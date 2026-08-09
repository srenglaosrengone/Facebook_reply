import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            Welcome to FB Page Manager ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy governs the privacy policies and practices of our application.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            When you use our application, we collect the following information via Facebook Login and the Facebook Graph API:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li><strong>Personal Information:</strong> Your name and email address for account creation and authentication.</li>
            <li><strong>Page Information:</strong> Facebook Page IDs, names, and access tokens for the pages you choose to connect.</li>
            <li><strong>Engagement Data:</strong> We receive Webhook events for comments on your connected Facebook Pages in order to process automatic replies.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the collected information for the sole purpose of providing our automated comment reply service:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>To authenticate your access to the dashboard.</li>
            <li>To listen for new comments on your connected Facebook Pages.</li>
            <li>To automatically publish reply comments on your behalf, strictly based on the keyword rules you configure.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Data Storage and Security</h2>
          <p className="text-gray-700 mb-4">
            Your data is stored securely using Supabase. We implement appropriate technical and organizational security measures to protect your Facebook access tokens and personal data from unauthorized access or disclosure.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Data Deletion and Revocation</h2>
          <p className="text-gray-700 mb-4">
            You have full control over your data. You can delete your rules, disconnect your pages, or delete your entire account directly from your dashboard. Additionally, you can revoke our application's access at any time through your Facebook Account Settings (Business Integrations). Once access is revoked, we immediately stop receiving Webhooks and can no longer interact with your pages.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions or concerns about this Privacy Policy, please contact us at privacy@example.com.
          </p>
        </div>
      </main>

      <footer className="bg-white py-6 border-t border-gray-200 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} FB Page Manager. All rights reserved.
      </footer>
    </div>
  )
}
