'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PlusCircle, RefreshCw, Facebook, Settings, Trash2 } from 'lucide-react'

type Page = {
  id: string
  page_id: string
  page_name: string
  auto_reply_enabled: boolean
  default_reply_enabled: boolean
  default_reply_message: string | null
}

export function PageManager({ initialPages, providerToken }: { initialPages: Page[], providerToken: string | null }) {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const fetchPagesFromFacebook = async () => {
    if (!providerToken) {
      // Re-authenticate to get a fresh provider token
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/pages`,
          scopes: 'pages_show_list,pages_manage_metadata,pages_read_engagement,pages_manage_engagement'
        }
      })
      if (authError) setError(authError.message)
      return
    }

    setIsFetching(true)
    setError('')

    try {
      // Call FB Graph API (in a real app, do this via a secure server route)
      const res = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${providerToken}`)
      const data = await res.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      const fbPages = data.data || []
      
      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      for (const p of fbPages) {
        const { error: insertError } = await supabase
          .from('facebook_pages')
          .upsert({
            user_id: user.id,
            page_id: p.id,
            page_name: p.name,
            access_token: p.access_token,
          }, { onConflict: 'user_id, page_id' })
        
        if (insertError) console.error('Insert error:', insertError)
      }

      // Refresh list
      const { data: refreshedPages } = await supabase
        .from('facebook_pages')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (refreshedPages) setPages(refreshedPages)

    } catch (err: any) {
      setError(err.message || 'Failed to fetch pages from Facebook.')
    } finally {
      setIsFetching(false)
    }
  }

  const toggleAutoReply = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    setPages(pages.map(p => p.id === id ? { ...p, auto_reply_enabled: newStatus } : p))
    
    try {
      // 1. Update Database
      await supabase.from('facebook_pages').update({ auto_reply_enabled: newStatus }).eq('id', id)
      
      // 2. Subscribe/Unsubscribe Page to Facebook App Webhooks
      await fetch('/api/facebook/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pageRecordId: id, 
          action: newStatus ? 'subscribe' : 'unsubscribe' 
        })
      })
    } catch (err) {
      console.error('Failed to update subscription:', err)
    }
  }

  const toggleDefaultReply = async (id: string, currentStatus: boolean) => {
    setPages(pages.map(p => p.id === id ? { ...p, default_reply_enabled: !currentStatus } : p))
    await supabase.from('facebook_pages').update({ default_reply_enabled: !currentStatus }).eq('id', id)
  }

  const updateDefaultReplyMessage = async (id: string, message: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, default_reply_message: message } : p))
    await supabase.from('facebook_pages').update({ default_reply_message: message }).eq('id', id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h3 className="font-medium text-gray-900">Sync with Facebook</h3>
          <p className="text-sm text-gray-500">Fetch your latest pages and permissions.</p>
        </div>
        <button
          onClick={fetchPagesFromFacebook}
          disabled={isFetching}
          className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm font-medium w-full sm:w-auto justify-center"
        >
          {isFetching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Facebook className="h-4 w-4 text-[#1877F2]" />}
          {isFetching ? 'Syncing...' : 'Fetch Pages'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {pages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Facebook className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-1">No Pages Found</p>
            <p className="text-sm">Click &quot;Fetch Pages&quot; to connect your Facebook pages.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pages.map((page) => (
              <li key={page.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-[#1877F2] flex-shrink-0">
                    <Facebook className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 break-all sm:break-normal">{page.page_name}</h4>
                    <p className="text-sm text-gray-500">ID: {page.page_id}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full sm:w-64 mt-4 sm:mt-0">
                  <label className="flex items-center cursor-pointer w-full bg-gray-50 p-2 rounded-md border border-gray-100">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={page.auto_reply_enabled}
                        onChange={() => toggleAutoReply(page.id, page.auto_reply_enabled)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${page.auto_reply_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${page.auto_reply_enabled ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-xs font-medium text-gray-700 flex-1">
                      Auto-Reply {page.auto_reply_enabled ? 'ON' : 'OFF'}
                    </span>
                  </label>

                  <label className="flex items-center cursor-pointer w-full bg-gray-50 p-2 rounded-md border border-gray-100">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={page.default_reply_enabled}
                        onChange={() => toggleDefaultReply(page.id, page.default_reply_enabled)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${page.default_reply_enabled ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${page.default_reply_enabled ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-xs font-medium text-gray-700 flex-1">
                      Default Reply {page.default_reply_enabled ? 'ON' : 'OFF'}
                    </span>
                  </label>

                  {page.default_reply_enabled && (
                    <div className="mt-1">
                      <textarea
                        defaultValue={page.default_reply_message || ''}
                        onBlur={(e) => updateDefaultReplyMessage(page.id, e.target.value)}
                        placeholder="Default reply message when no keywords match..."
                        className="w-full text-xs border border-gray-200 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
