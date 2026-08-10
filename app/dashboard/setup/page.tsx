import { ShieldCheck, Link2, Key, AlertTriangle } from 'lucide-react'

export default function SetupGuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Platform Setup Guide</h2>
        <p className="text-gray-600 mt-1">Follow these steps to fix connection issues and enable Webhooks.</p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Seeing &quot;localhost refused to connect&quot;?</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                This happens because your Supabase project&apos;s Site URL is still set to <code>http://localhost:3000</code>.
                When Facebook redirects you back, it sends you to localhost instead of this live app.
              </p>
            </div>
          </div>
        </div>
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
          <h3 className="text-lg font-medium text-gray-900">Fix the Localhost Issue in Supabase</h3>
        </div>
        <div className="p-6 prose prose-blue max-w-none text-gray-600">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Go to your <strong>Supabase Dashboard</strong>.</li>
            <li>Navigate to <strong>Authentication &gt; URL Configuration</strong> (under Configuration).</li>
            <li>Change the <strong>Site URL</strong> to this app&apos;s URL. Make sure it doesn&apos;t end with a slash.</li>
            <li>Scroll down to <strong>Redirect URLs</strong> and click &quot;Add URL&quot;. Add <code>{`https://<YOUR_APP_URL>/*`}</code></li>
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold">3</div>
          <h3 className="text-lg font-medium text-gray-900">Setup Facebook Webhooks</h3>
        </div>
        <div className="p-6 prose prose-blue max-w-none text-gray-600">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Go to the <a href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer" className="text-[#1877F2]">Facebook Developer Dashboard</a>.</li>
            <li>Select your App (e.g., &quot;AI Daily News&quot;).</li>
            <li>On the left sidebar, find <strong>Webhooks</strong>. If not there, click &quot;Add Product&quot; and add Webhooks.</li>
            <li>Select <strong>Page</strong> from the dropdown menu, then click <strong>Subscribe to this object</strong>.</li>
            <li>
              A dialog will appear. Enter the following:
              <ul className="list-disc pl-5 mt-2 mb-2">
                <li><strong>Callback URL:</strong> <code>YOUR_APP_URL/api/webhooks/facebook</code> (Replace YOUR_APP_URL with the actual domain of this site)</li>
                <li><strong>Verify Token:</strong> The value you put in your <code>FACEBOOK_VERIFY_TOKEN</code> secret in AI Studio.</li>
              </ul>
            </li>
            <li>Click <strong>Verify and Save</strong>.</li>
            <li>After saving, scroll down the list of Webhook fields, find <strong>feed</strong>, and click <strong>Subscribe</strong>.</li>
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold">4</div>
          <h3 className="text-lg font-medium text-gray-900">Verify Supabase Facebook Provider</h3>
        </div>
        <div className="p-6 prose prose-blue max-w-none text-gray-600">
          <ol className="list-decimal pl-5 space-y-2">
            <li>In Supabase, go to <strong>Authentication &gt; Providers &gt; Facebook</strong>.</li>
            <li>Ensure the Facebook App ID and Secret match exactly what&apos;s in the Facebook Developer console.</li>
            <li>Copy the <strong>Callback URL (for OAuth)</strong> from Supabase.</li>
            <li>Go to Facebook Developer Dashboard &gt; <strong>Facebook Login &gt; Settings</strong>.</li>
            <li>Paste the Supabase Callback URL into <strong>Valid OAuth Redirect URIs</strong> and save changes.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
