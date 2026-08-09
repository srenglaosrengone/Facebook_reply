import { LoginButton } from '@/components/login-button'
import { MessageCircle, Zap, ShieldCheck } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-[#1877F2]" />
          <span className="text-xl font-bold text-gray-900">FB Page Manager</span>
        </div>
        <div>
          <LoginButton />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Automate your Facebook Page engagement
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          Connect your pages, set keyword-based rules, and let our system automatically reply to comments 24/7. Never miss a lead again.
        </p>
        <div className="mb-16">
          <LoginButton />
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full text-left">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Zap className="h-8 w-8 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Replies</h3>
            <p className="text-gray-600">Reply to customer comments within seconds using automated webhooks.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <MessageCircle className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Keyword Rules</h3>
            <p className="text-gray-600">Set specific responses based on keywords found in the customer&apos;s comment.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ShieldCheck className="h-8 w-8 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">Built on Supabase and official Facebook Graph APIs for maximum security.</p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t border-gray-200 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} FB Page Manager. All rights reserved.
      </footer>
    </div>
  )
}
