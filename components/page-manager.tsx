'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { RefreshCw, Facebook, Trash2, Key, Link2, AlertCircle, Eye, EyeOff } from 'lucide-react'

type Page = {
  id: string
  page_id: string
  page_name: string
  page_picture_url: string | null
  auto_reply_enabled: boolean
}

export function PageManager({ initialPages }: { initialPages: Page[] }) {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [isConnecting, setIsConnecting] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()

  const handleConnectPage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenInput.trim()) return

    setIsConnecting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/facebook/pages/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: tokenInput.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect page')
      }

      setSuccess(`Successfully connected page: ${data.page.page_name}`)
      setTokenInput('')
      
      // Refresh list
      const { data: refreshedPages } = await supabase
        .from('facebook_pages')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (refreshedPages) setPages(refreshedPages)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async (pageId: string) => {
    if (!confirm('Are you sure you want to disconnect this page?')) return
    
    setError('')
    try {
      const res = await fetch('/api/facebook/pages/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setPages(pages.filter(p => p.page_id !== pageId))
      setSuccess('Page disconnected successfully')
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect page')
    }
  }

  const toggleAutoReply = async (id: string, currentStatus: boolean) => {
    setPages(pages.map(p => p.id === id ? { ...p, auto_reply_enabled: !currentStatus } : p))
    
    await supabase
      .from('facebook_pages')
      .update({ auto_reply_enabled: !currentStatus })
      .eq('id', id)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Connect a Facebook Page</h3>
        <p className="text-sm text-gray-500 mb-6">
          Paste your long-lived Facebook Page Access Token here. We never expose your token after it's saved.
        </p>

        <form onSubmit={handleConnectPage} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
              Page Access Token
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showToken ? "text" : "password"}
                name="token"
                id="token"
                required
                className="focus:ring-[#1877F2] focus:border-[#1877F2] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="EAAB..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                >
                  {showToken ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isConnecting || !tokenInput}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#1877F2] text-white px-4 py-2 rounded-md hover:bg-[#1864F2] transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {isConnecting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
            {isConnecting ? 'Connecting...' : 'Connect Page'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md text-sm border border-red-100 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md text-sm border border-green-100 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Your Connected Pages</h3>
        </div>
        {pages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Facebook className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-1">No Pages Found</p>
            <p className="text-sm">Connect a page using a token above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pages.map((page) => (
              <li key={page.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {page.page_picture_url ? (
                    <img src={page.page_picture_url} alt={page.page_name} className="h-12 w-12 rounded-full border border-gray-200" />
                  ) : (
                    <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-[#1877F2] flex-shrink-0">
                      <Facebook className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 break-all sm:break-normal">{page.page_name}</h4>
                    <p className="text-sm text-gray-500">ID: {page.page_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                  <label className="flex items-center cursor-pointer w-full sm:w-auto bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-md border sm:border-0 border-gray-100">
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
                    <span className="ml-3 text-sm font-medium text-gray-700 flex-1">
                      Auto-Reply
                    </span>
                  </label>
                  
                  <button 
                    onClick={() => handleDisconnect(page.page_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Disconnect Page"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
