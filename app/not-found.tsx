import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            404 - Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The page you're looking for doesn't exist.
          </p>
        </div>
        <div className="mt-5">
          <Link
            href="/"
            className="text-base font-medium text-[#1877F2] hover:text-[#1864F2]"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}
