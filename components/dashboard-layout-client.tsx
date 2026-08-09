'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Settings, LayoutDashboard, Menu, X } from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'

export function DashboardLayoutClient({ 
  children, 
  userEmail 
}: { 
  children: React.ReactNode
  userEmail: string 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/pages', label: 'Manage Pages', icon: Settings },
    { href: '/dashboard/rules', label: 'Reply Rules', icon: MessageCircle },
    { href: '/dashboard/setup', label: 'Setup Guide', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 text-[#1877F2] mr-2" />
          <span className="text-lg font-bold text-gray-900">FB Manager</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Overlay) */}
      <aside className={`
        ${isMobileMenuOpen ? 'fixed inset-0 top-[60px] flex' : 'hidden'} 
        md:flex md:sticky md:top-0 md:h-screen flex-col w-full md:w-64 bg-white border-r border-gray-200 
        z-20 shadow-lg md:shadow-none
      `}>
        <div className="hidden md:flex h-16 items-center px-6 border-b border-gray-200">
          <MessageCircle className="h-6 w-6 text-[#1877F2] mr-2" />
          <span className="text-lg font-bold text-gray-900">FB Manager</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-gray-500' : 'text-gray-400'}`} />
                {link.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-gray-700 truncate">{userEmail}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:h-screen overflow-y-auto">
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center px-8 flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-800">
            {navLinks.find(l => l.href === pathname)?.label || 'Dashboard'}
          </h1>
        </header>
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
