import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
        <p className="text-gray-600 mb-6">
          There was a problem signing you in with Facebook. This could be due to a configuration issue or a network error.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-[#1877F2] text-white px-6 py-2 rounded-md font-medium hover:bg-[#1864F2] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
