import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
              CalendarMap
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/docs" className="text-gray-600 hover:text-gray-900">Docs</Link>
            <Link href="/cli" className="text-gray-600 hover:text-gray-900">CLI</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/#enterprise" className="text-gray-600 hover:text-gray-900">Contact</Link>
            <Link href="https://github.com/codebruinc/calendarmap" className="text-gray-600 hover:text-gray-900">GitHub</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
