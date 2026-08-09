import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

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
    const body = await request.json()

    // Facebook sends events under 'entry' array
    if (body.object === 'page' && body.entry) {
      const supabase = createAdminClient()

      for (const entry of body.entry) {
        const pageId = entry.id
        
        // Check if this page is registered and auto_reply is enabled
        const { data: pageRecord } = await supabase
          .from('facebook_pages')
          .select('*')
          .eq('page_id', pageId)
          .eq('auto_reply_enabled', true)
          .single()

        if (!pageRecord) continue // Page not found or auto-reply disabled

        for (const messaging of entry.changes || []) {
          // Process comments on feed
          if (messaging.field === 'feed' && messaging.value.item === 'comment' && messaging.value.verb === 'add') {
            const commentId = messaging.value.comment_id
            const commentText = messaging.value.message || ''
            const senderId = messaging.value.from.id

            // Fetch rules for this page
            const { data: rules } = await supabase
              .from('reply_rules')
              .select('*')
              .eq('page_id', pageRecord.id)

            let matchedReply = null

            // Simple keyword matching (case-insensitive)
            if (rules && rules.length > 0) {
              const lowerComment = commentText.toLowerCase()
              for (const rule of rules) {
                if (lowerComment.includes(rule.keyword.toLowerCase())) {
                  matchedReply = rule.reply_message
                  break // Match first rule found
                }
              }
            }

            if (matchedReply) {
              // Send reply via Graph API
              try {
                const res = await fetch(`https://graph.facebook.com/v19.0/${commentId}/comments`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    message: matchedReply,
                    access_token: pageRecord.access_token
                  })
                })
                const resData = await res.json()

                if (resData.error) throw new Error(resData.error.message)

                // Log success
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
                // Log error
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
