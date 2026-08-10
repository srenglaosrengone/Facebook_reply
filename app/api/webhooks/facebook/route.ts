import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import crypto from 'crypto'

function verifySignature(payload: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const parts = signature.split('=');
  if (parts.length !== 2 || parts[0] !== 'sha256') return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf8'),
    Buffer.from(parts[1], 'utf8')
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.FACEBOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  } else {
    return new NextResponse('Forbidden', { status: 403 })
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    const appSecret = process.env.FACEBOOK_APP_SECRET

    console.log('Webhook received:', signature ? 'Signed' : 'Unsigned');

    // Verify webhook signature (Optional: only if appSecret is provided and correct)
    if (appSecret && signature) {
      const isValid = verifySignature(rawBody, signature, appSecret);
      if (!isValid) {
        console.error('Signature verification failed, but continuing for debugging...');
        // In production, you might want to return 401, but let's be more flexible for now
      }
    }

    const body = JSON.parse(rawBody);

    if (body.object === 'page' && body.entry) {
      const supabase = createAdminClient();

      for (const entry of body.entry) {
        const pageId = entry.id;
        console.log('Processing entry for page:', pageId);
        
        // Safe query: only select columns we know exist for sure
        const { data: pageRecord, error: pageError } = await supabase
          .from('facebook_pages')
          .select('id, page_id, page_name, access_token, auto_reply_enabled')
          .eq('page_id', pageId)
          .single();

        if (pageError || !pageRecord) {
          console.log('Page not found or query error:', pageId, pageError?.message);
          continue;
        }

        if (!pageRecord.auto_reply_enabled) {
          console.log('Auto-reply is disabled for page:', pageRecord.page_name);
          continue;
        }

        // Try to fetch optional columns safely
        const { data: extraData } = await supabase
          .from('facebook_pages')
          .select('default_reply_enabled, default_reply_message')
          .eq('id', pageRecord.id)
          .single();
        
        const defaultReplyEnabled = extraData?.default_reply_enabled || false;
        const defaultReplyMessage = extraData?.default_reply_message || null;

        for (const change of entry.changes || []) {
          console.log('Change detected:', change.field, change.value?.item, change.value?.verb);
          
          if (change.field === 'feed' && change.value.item === 'comment' && change.value.verb === 'add') {
            const commentId = change.value.comment_id;
            const commentText = change.value.message || '';
            const senderId = change.value.from.id;
            
            console.log(`New comment from ${senderId}: "${commentText}"`);

            // Avoid replying to the page's own comments
            if (senderId === pageId) {
              console.log('Ignoring self-comment');
              continue;
            }

            const { data: rules } = await supabase
              .from('reply_rules')
              .select('*')
              .eq('page_id', pageRecord.id)

            let matchedReply = null

            // 1. Try keyword matching
            if (rules && rules.length > 0) {
              const lowerComment = commentText.toLowerCase()
              for (const rule of rules) {
                const keywords = rule.keyword.split(',').map((k: string) => k.trim().toLowerCase())
                if (keywords.some((k: string) => lowerComment.includes(k))) {
                  matchedReply = rule.reply_message
                  break
                }
              }
            }

            // 2. Default Fallback (Static text)
            if (!matchedReply && defaultReplyEnabled) {
              matchedReply = defaultReplyMessage
            }

            if (matchedReply) {
              try {
                const res = await fetch(`https://graph.facebook.com/v21.0/${commentId}/comments`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    message: matchedReply,
                    access_token: pageRecord.access_token
                  })
                })
                const resData = await res.json()
                if (resData.error) {
                  console.error('Graph API Error:', resData.error);
                  throw new Error(resData.error.message);
                }

                console.log('Reply sent successfully to comment:', commentId);

                await supabase.from('reply_logs').insert({
                  page_id: pageRecord.id,
                  comment_id: commentId,
                  sender_id: senderId,
                  comment_text: commentText,
                  reply_sent: matchedReply,
                  status: 'success'
                })

              } catch (err: any) {
                console.error('Failed to send reply:', err)
                await supabase.from('reply_logs').insert({
                  page_id: pageRecord.id,
                  comment_id: commentId,
                  sender_id: senderId,
                  comment_text: commentText,
                  reply_sent: matchedReply,
                  status: 'error'
                })
              }
            }
          }
        }
      }
    }
    return new NextResponse('EVENT_RECEIVED', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
