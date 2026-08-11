export default function LogsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reply Logs</h2>
        <p className="text-gray-600 mt-1">History of automated replies sent by the system.</p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">Logs will appear here once replies start triggering.</p>
      </div>
    </div>
  )
}
