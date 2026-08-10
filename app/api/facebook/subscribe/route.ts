import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(request: Request) {
  try {
    const { pageRecordId, action } = await request.json()
    
    const supabase = createAdminClient()
    
    // Fetch the page record including access token
    const { data: page, error: fetchError } = await supabase
      .from('facebook_pages')
      .select('*')
      .eq('id', pageRecordId)
      .single()
      
    if (fetchError || !page) {
      return new NextResponse('Page not found', { status: 404 })
    }

    const graphApiVersion = 'v21.0'
    const url = `https://graph.facebook.com/${graphApiVersion}/${page.page_id}/subscribed_apps`
    
    if (action === 'subscribe') {
      // Subscribe the page to the app
      const res = await fetch(`${url}?subscribed_fields=feed&access_token=${page.access_token}`, {
        method: 'POST'
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      console.log(`Successfully subscribed page ${page.page_name} to app`)
    } else {
      // Unsubscribe
      const res = await fetch(`${url}?access_token=${page.access_token}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      console.log(`Successfully unsubscribed page ${page.page_name} from app`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Facebook Subscription Error:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
