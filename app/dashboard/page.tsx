import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { PlusCircle, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch user's pages (Safe select)
  const { data: pages } = await supabase
    .from('facebook_pages')
    .select('id, page_id, page_name, auto_reply_enabled, created_at')
    .order('created_at', { ascending: false })

  // Fetch recent logs if pages exist
  let recentLogs: any[] = []
  if (pages && pages.length > 0) {
    const pageIds = pages.map(p => p.id)
    const { data: logs } = await supabase
      .from('reply_logs')
      .select('*')
      .in('page_id', pageIds)
      .order('created_at', { ascending: false })
      .limit(5)
    
    // Manually attach page name
    if (logs) {
      logs.forEach(log => {
        const page = pages.find(p => p.id === log.page_id)
        log.facebook_pages = { page_name: page?.page_name || 'Unknown' }
      })
    }
    
    recentLogs = logs || []
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Connected Pages</h3>
          <p className="text-3xl font-bold text-gray-900">{pages?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Auto Replies Sent</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-xs text-gray-400 mt-1">Coming soon with analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Pages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Your Pages</h3>
            <Link href="/dashboard/pages" className="text-sm text-[#1877F2] font-medium hover:underline">
              Manage
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {!pages || pages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="mb-4">No pages connected yet.</p>
                <Link 
                  href="/dashboard/pages" 
                  className="inline-flex items-center text-sm font-medium text-white bg-[#1877F2] px-4 py-2 rounded-md hover:bg-[#1864F2]"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Connect a Page
                </Link>
              </div>
            ) : (
              pages.slice(0, 5).map((page) => (
                <div key={page.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{page.page_name}</p>
                    <p className="text-xs text-gray-500">ID: {page.page_id}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${page.auto_reply_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {page.auto_reply_enabled ? 'Active' : 'Paused'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Activity className="h-8 w-8 text-gray-300 mb-3" />
                <p>No recent activity.</p>
              </div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="px-6 py-4">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{log.facebook_pages.page_name}</p>
                    <span className="text-xs text-gray-500">{new Date(log.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">&quot;{log.comment_text}&quot;</p>
                  <p className="text-xs mt-1 text-green-600">↳ Replying: &quot;{log.reply_sent}&quot;</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
