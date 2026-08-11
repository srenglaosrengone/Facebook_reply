import { createClient } from '@/utils/supabase/server'
import { PageManager } from '@/components/page-manager'

export default async function ManagePagesPage() {
  const supabase = await createClient()
  
  const { data: pages } = await supabase
    .from('facebook_pages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Manage Pages</h2>
        <p className="text-gray-600 mt-1">Connect your Facebook pages using an access token.</p>
      </div>
      <PageManager initialPages={pages || []} />
    </div>
  )
}
