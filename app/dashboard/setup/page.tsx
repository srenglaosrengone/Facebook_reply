import { ShieldCheck, Link2, Key, AlertTriangle } from 'lucide-react'

export default function SetupGuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Platform Setup Guide</h2>
        <p className="text-gray-600 mt-1">Follow these steps to configure your Facebook Pages and Webhooks.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold">1</div>
          <h3 className="text-lg font-medium text-gray-900">Run the Database Schema</h3>
        </div>
        <div className="p-6 prose prose-blue max-w-none text-gray-600">
          <p>Your database needs tables to store your pages and auto-reply rules.</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Open the file <code>supabase-schema.sql</code> in this project.</li>
            <li>Copy all of its contents.</li>
            <li>Go to your <strong>Supabase Dashboard</strong> &gt; <strong>SQL Editor</strong>.</li>
            <li>Click <strong>New query</strong>, paste the code, and click <strong>Run</strong>.</li>
            <li>Verify you get a "Success" message indicating tables were created.</li>
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold">2</div>
          <h3 className="text-lg font-medium text-gray-900">Get a Page Access Token</h3>
        </div>
        <div className="p-6 prose prose-blue max-w-none text-gray-600">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Go to the <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer" className="text-[#1877F2]">Graph API Explorer</a>.</li>
            <li>Select your Facebook App in the "Meta App" dropdown.</li>
            <li>In the "User or Page" dropdown, select <strong>Get Page Access Token</strong> and select the page you want to manage.</li>
            <li>Add the required permissions: <code>pages_show_list, pages_manage_metadata, pages_read_engagement, pages_manage_engagement</code></li>
            <li>Click <strong>Generate Access Token</strong> and copy the token.</li>
            <li>We recommend extending the token to be long-lived via the "Access Token Tool" before saving it here.</li>
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold">3</div>
          <h3 className="text-lg font-medium text-gray-900">Setup Facebook Webhooks (Phase 3 Prep)</h3>
        </div>
        <div className="p-6 prose prose-blue max-w-none text-gray-600">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Go to the <a href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer" className="text-[#1877F2]">Facebook Developer Dashboard</a>.</li>
            <li>Select your App.</li>
            <li>On the left sidebar, find <strong>Webhooks</strong>. If not there, click "Add Product" and add Webhooks.</li>
            <li>Select <strong>Page</strong> from the dropdown menu, then click <strong>Subscribe to this object</strong>.</li>
            <li>
              A dialog will appear. Enter the following:
              <ul className="list-disc pl-5 mt-2 mb-2">
                <li><strong>Callback URL:</strong> <code>YOUR_APP_URL/api/webhooks/facebook</code></li>
                <li><strong>Verify Token:</strong> The value you put in your <code>FACEBOOK_VERIFY_TOKEN</code> environment variable.</li>
              </ul>
            </li>
            <li>Click <strong>Verify and Save</strong>.</li>
            <li>After saving, scroll down the list of Webhook fields, find <strong>feed</strong>, and click <strong>Subscribe</strong>.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
