import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { validatePageToken } from '@/lib/facebook/client'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { accessToken } = await req.json()

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    // 1. Validate token with Facebook
    const pageData = await validatePageToken(accessToken)

    // 2. Check if page is already connected by this user
    const { data: existingPage, error: checkError } = await supabase
      .from('facebook_pages')
      .select('id')
      .eq('user_id', user.id)
      .eq('page_id', pageData.page_id)
      .single()

    if (existingPage) {
      // Update existing page token and details
      const { error: updateError } = await supabase
        .from('facebook_pages')
        .update({
          access_token: accessToken,
          page_name: pageData.page_name,
          page_username: pageData.page_username,
          page_picture_url: pageData.page_picture_url,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPage.id)

      if (updateError) throw updateError
    } else {
      // Insert new page
      const { error: insertError } = await supabase
        .from('facebook_pages')
        .insert({
          user_id: user.id,
          page_id: pageData.page_id,
          page_name: pageData.page_name,
          page_username: pageData.page_username,
          page_picture_url: pageData.page_picture_url,
          access_token: accessToken,
          is_active: true,
          auto_reply_enabled: false
        })

      if (insertError) throw insertError
    }

    return NextResponse.json({ success: true, page: pageData })
  } catch (error: any) {
    console.error('Error connecting page:', error)
    return NextResponse.json({ error: error.message || 'Failed to connect page' }, { status: 500 })
  }
}
