import Link from 'next/link'

export function LoginButton() {
  return (
    <div className="flex gap-4">
      <Link
        href="/login"
        className="text-sm font-semibold leading-6 text-gray-900"
      >
        Log in <span aria-hidden="true">&rarr;</span>
      </Link>
      <Link
        href="/signup"
        className="rounded-md bg-[#1877F2] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1864F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1877F2]"
      >
        Sign up
      </Link>
    </div>
  )
}
