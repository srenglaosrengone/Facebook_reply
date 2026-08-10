import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import crypto from 'crypto'

function verifySignature(payload: string, signature: string | null, secret: string) {
  if (!signature) return false
  const [algo, sig] = signature.split('=')
  if (algo !== 'sha256') return false
  
  const hmac = crypto.createHmac('sha256', secret)
  const digest = Buffer.from(hmac.update(payload).digest('hex'), 'utf8')
  const checksum = Buffer.from(sig, 'utf8')
  
  return digest.length === checksum.length && crypto.timingSafeEqual(digest, checksum)
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

    // Verify webhook signature
    if (appSecret && !verifySignature(rawBody, signature, appSecret)) {
      console.error('Invalid signature')
      return new NextResponse('Invalid signature', { status: 401 })
    }

    const body = JSON.parse(rawBody)

    if (body.object === 'page' && body.entry) {
      const supabase = createAdminClient()

      for (const entry of body.entry) {
        const pageId = entry.id
        
        const { data: pageRecord } = await supabase
          .from('facebook_pages')
          .select('*')
          .eq('page_id', pageId)
          .eq('auto_reply_enabled', true)
          .single()

        if (!pageRecord) continue

        for (const messaging of entry.changes || []) {
          if (messaging.field === 'feed' && messaging.value.item === 'comment' && messaging.value.verb === 'add') {
            const commentId = messaging.value.comment_id
            const commentText = messaging.value.message || ''
            const senderId = messaging.value.from.id
            
            // Avoid replying to the page's own comments
            if (senderId === pageId) continue

            const { data: rules } = await supabase
              .from('reply_rules')
              .select('*')
              .eq('page_id', pageRecord.id)

            let matchedReply = null
            let isAiReply = false

            // 1. Try keyword matching
            if (rules && rules.length > 0) {
              const lowerComment = commentText.toLowerCase()
              for (const rule of rules) {
                // Support multiple keywords separated by commas
                const keywords = rule.keyword.split(',').map((k: string) => k.trim().toLowerCase())
                if (keywords.some((k: string) => lowerComment.includes(k))) {
                  matchedReply = rule.reply_message
                  break
                }
              }
            }

            // 2. AI Fallback if enabled
            if (!matchedReply && pageRecord.ai_reply_enabled) {
              try {
                const aiResponse = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/v1/chat/completions`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`
                  },
                  body: JSON.stringify({
                    model: 'gpt-5-mini',
                    messages: [
                      { 
                        role: 'system', 
                        content: `You are a helpful assistant for the Facebook page "${pageRecord.page_name}". ${pageRecord.ai_prompt_instruction || 'Provide a polite and helpful reply to the customer comment.'} Keep the reply concise and natural.` 
                      },
                      { role: 'user', content: commentText }
                    ],
                    max_tokens: 200
                  })
                })
                const aiData = await aiResponse.json()
                matchedReply = aiData.choices[0]?.message?.content
                isAiReply = true
              } catch (aiErr) {
                console.error('AI Reply failed:', aiErr)
              }
            }

            if (matchedReply) {
              try {
                // Using v21.0 for Graph API
                const res = await fetch(`https://graph.facebook.com/v21.0/${commentId}/comments`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    message: matchedReply,
                    access_token: pageRecord.access_token
                  })
                })
                const resData = await res.json()
                if (resData.error) throw new Error(resData.error.message)

                await supabase.from('reply_logs').insert({
                  page_id: pageRecord.id,
                  comment_id: commentId,
                  sender_id: senderId,
                  comment_text: commentText,
                  reply_sent: matchedReply,
                  status: 'success',
                  is_ai_reply: isAiReply
                })

              } catch (err: any) {
                console.error('Failed to send reply:', err)
                await supabase.from('reply_logs').insert({
                  page_id: pageRecord.id,
                  comment_id: commentId,
                  sender_id: senderId,
                  comment_text: commentText,
                  reply_sent: matchedReply,
                  status: 'error',
                  is_ai_reply: isAiReply
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
