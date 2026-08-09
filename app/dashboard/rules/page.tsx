import { createClient } from '@/utils/supabase/server'
import { RulesManager } from '@/components/rules-manager'

export default async function RulesPage() {
  const supabase = await createClient()
  
  // Fetch user's pages to select from
  const { data: pages } = await supabase
    .from('facebook_pages')
    .select('id, page_name')
    .order('created_at', { ascending: false })

  let initialRules: any[] = []
  if (pages && pages.length > 0) {
    // Fetch rules for the first page by default, or all rules
    const { data: rules } = await supabase
      .from('reply_rules')
      .select('*, facebook_pages(page_name)')
      .in('page_id', pages.map(p => p.id))
      .order('created_at', { ascending: false })
      
    initialRules = rules || []
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reply Rules</h2>
        <p className="text-gray-600 mt-1">Configure automated replies based on keywords in comments.</p>
      </div>

      <RulesManager pages={pages || []} initialRules={initialRules} />
    </div>
  )
}
