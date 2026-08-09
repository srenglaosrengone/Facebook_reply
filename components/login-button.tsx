'use client'

import { createClient } from '@/utils/supabase/client'
import { Facebook } from 'lucide-react'
import { useState } from 'react'

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'pages_show_list,pages_manage_metadata,pages_read_engagement,pages_manage_engagement'
      }
    })
    
    if (error) {
      console.error('Error logging in:', error.message)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 rounded-md bg-[#1877F2] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1864F2] focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 disabled:opacity-70 transition-colors"
    >
      <Facebook className="h-5 w-5" />
      {isLoading ? 'Connecting...' : 'Continue with Facebook'}
    </button>
  )
}
