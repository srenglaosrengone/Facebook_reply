export default function CommentsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
        <p className="text-gray-600 mt-1">View comments from your connected pages.</p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">Comments will appear here once the webhook is fully connected.</p>
      </div>
    </div>
  )
}
