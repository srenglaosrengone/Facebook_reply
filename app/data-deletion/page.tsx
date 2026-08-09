import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-[#1877F2]" />
          <span className="text-xl font-bold text-gray-900">FB Page Manager</span>
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto py-12 px-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 prose prose-blue max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Data Deletion Instructions</h1>
          
          <p className="text-gray-700 mb-4">
            FB Page Manager is a Facebook login app and we do not save your personal data in our server permanently without your permission.
            According to Facebook policy, we have to provide User Data Deletion Callback URL or Data Deletion Instructions URL.
          </p>
          
          <p className="text-gray-700 mb-4">
            If you want to delete your activities or data related to FB Page Manager from Facebook, you can remove your information by following these steps:
          </p>

          <ol className="list-decimal pl-6 text-gray-700 mb-8 space-y-3">
            <li>Go to your Facebook Account&apos;s <strong>Settings &amp; Privacy</strong>. Click <strong>Settings</strong>.</li>
            <li>Look for <strong>Apps and Websites</strong> and you will see all of the apps and websites you linked with your Facebook.</li>
            <li>Search and click <strong>FB Page Manager</strong> (or your App Name) in the search bar.</li>
            <li>Scroll and click <strong>Remove</strong>.</li>
            <li>Congratulations, you have successfully removed your app activities and data from FB Page Manager.</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">Deleting Your Data in Our System</h2>
          <p className="text-gray-700 mb-4">
            If you wish to completely delete your account and all associated rules, logs, and page configurations from our database, please contact us at privacy@example.com with the subject line &quot;Account Deletion Request&quot;, and we will process the deletion of all your data within 48 hours.
          </p>
        </div>
      </main>

      <footer className="bg-white py-6 border-t border-gray-200 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
        <p>&copy; {new Date().getFullYear()} FB Page Manager. All rights reserved.</p>
        <div className="flex gap-4 justify-center mt-2">
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          <Link href="/data-deletion" className="hover:text-gray-900 transition-colors">Data Deletion</Link>
        </div>
      </footer>
    </div>
  )
}
