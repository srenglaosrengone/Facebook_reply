import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pageId } = await req.json()

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    // We simply delete the page record from our database
    const { error: deleteError } = await supabase
      .from('facebook_pages')
      .delete()
      .eq('user_id', user.id)
      .eq('page_id', pageId)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error disconnecting page:', error)
    return NextResponse.json({ error: error.message || 'Failed to disconnect page' }, { status: 500 })
  }
}
