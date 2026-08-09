import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MessageCircle, Settings, LogOut, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { LogoutButton } from '@/components/logout-button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <MessageCircle className="h-6 w-6 text-[#1877F2] mr-2" />
          <span className="text-lg font-bold text-gray-900">FB Manager</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400" />
            Dashboard
          </Link>
          <Link href="/dashboard/pages" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Settings className="mr-3 h-5 w-5 text-gray-400" />
            Manage Pages
          </Link>
          <Link href="/dashboard/rules" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <MessageCircle className="mr-3 h-5 w-5 text-gray-400" />
            Reply Rules
          </Link>
          <Link href="/dashboard/setup" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Settings className="mr-3 h-5 w-5 text-gray-400" />
            Setup Guide
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
