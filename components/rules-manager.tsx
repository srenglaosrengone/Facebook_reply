'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PlusCircle, Trash2 } from 'lucide-react'

type Page = { id: string, page_name: string }
type Rule = {
  id: string
  page_id: string
  keyword: string
  reply_message: string
  reply_type: string
  facebook_pages?: { page_name: string }
}

export function RulesManager({ pages, initialRules }: { pages: Page[], initialRules: Rule[] }) {
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedPage, setSelectedPage] = useState(pages[0]?.id || '')
  const [keyword, setKeyword] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [replyType, setReplyType] = useState('public')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPage || !keyword || !replyMessage) return

    setLoading(true)
    const { data, error } = await supabase
      .from('reply_rules')
      .insert({
        page_id: selectedPage,
        keyword: keyword,
        reply_message: replyMessage,
        reply_type: replyType
      })
      .select('*, facebook_pages(page_name)')
      .single()

    if (error) {
      console.error(error)
    } else if (data) {
      setRules([data, ...rules])
      setKeyword('')
      setReplyMessage('')
      setIsAdding(false)
    }
    setLoading(false)
  }

  const handleDeleteRule = async (id: string) => {
    setRules(rules.filter(r => r.id !== id))
    await supabase.from('reply_rules').delete().eq('id', id)
  }

  if (pages.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">You need to connect a Facebook Page before creating rules.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Your Rules</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-md hover:bg-[#1864F2] transition-colors text-sm font-medium"
        >
          <PlusCircle className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddRule} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Page</label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-[#1877F2] focus:border-[#1877F2] outline-none"
                required
              >
                {pages.map(p => <option key={p.id} value={p.id}>{p.page_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keyword Trigger</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. price, how much, address"
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-[#1877F2] focus:border-[#1877F2] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reply Message</label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Enter the reply message..."
                rows={3}
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-[#1877F2] focus:border-[#1877F2] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reply Type</label>
              <select
                value={replyType}
                onChange={(e) => setReplyType(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-[#1877F2] focus:border-[#1877F2] outline-none"
              >
                <option value="public">Public Comment</option>
                <option value="private">Private Message (DM)</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1877F2] rounded-md hover:bg-[#1864F2] disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Rule'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {rules.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No rules found. Add one to get started.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {rules.map((rule) => (
              <li key={rule.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {rule.facebook_pages?.page_name}
                      </span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${rule.reply_type === 'private' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {rule.reply_type === 'private' ? 'Private' : 'Public'}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      If comment contains: <span className="text-[#1877F2]">&quot;{rule.keyword}&quot;</span>
                    </h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100 mt-2">
                      ↳ {rule.reply_message}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete rule"
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
