import { createClient } from '@/utils/supabase/server'
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react'

export default async function ActivityPage() {
  const supabase = await createClient()
  
  const { data: pages } = await supabase
    .from('facebook_pages')
    .select('id, page_name')

  const { data: logs } = await supabase
    .from('reply_logs')
    .select('id, page_id, comment_id, sender_id, comment_text, reply_sent, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (logs && pages) {
    logs.forEach(log => {
      const page = pages.find(p => p.id === log.page_id)
      log.facebook_pages = { page_name: page?.page_name || 'Unknown' }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Activity Logs</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {!logs || logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No activity logs found yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Page</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Reply</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {log.facebook_pages?.page_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {log.comment_text}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-xs">{log.reply_sent}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {log.status === 'success' ? (
                        <span className="flex items-center text-green-600 gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Success
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 gap-1">
                          <AlertCircle className="h-4 w-4" /> Error
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
