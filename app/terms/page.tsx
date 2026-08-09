import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing or using FB Page Manager, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
          <p className="text-gray-700 mb-4">
            FB Page Manager is a software-as-a-service (SaaS) application that allows users to manage their Facebook Pages and automate replies to comments based on predefined keyword rules. We utilize the Facebook Graph API and Webhooks to provide this functionality.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
          <p className="text-gray-700 mb-4">
            As a user, you agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Provide accurate and complete information during registration.</li>
            <li>Maintain the security of your account and Facebook connection.</li>
            <li>Use the service in compliance with Facebook's Platform Terms and Developer Policies.</li>
            <li>Not use the service for spam, harassment, or any illegal activities.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Facebook Integration</h2>
          <p className="text-gray-700 mb-4">
            Our service relies on the Facebook platform. We are not affiliated with, endorsed by, or sponsored by Facebook (Meta). Your use of the Facebook platform is subject to Facebook's own terms and policies. We are not responsible for any changes Facebook makes to its API that may affect our service functionality.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            To the maximum extent permitted by law, FB Page Manager shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of your use of or inability to use the service.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these Terms of Service at any time. We will notify users of any significant changes. Your continued use of the service after such modifications constitutes your acceptance of the new terms.
          </p>
        </div>
      </main>

      <footer className="bg-white py-6 border-t border-gray-200 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
        <p>&copy; {new Date().getFullYear()} FB Page Manager. All rights reserved.</p>
        <div className="flex gap-4 justify-center mt-2">
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}
