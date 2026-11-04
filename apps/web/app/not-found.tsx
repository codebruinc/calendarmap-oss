import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h2>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">📅 Convert Events</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/map/calendar-ics" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    CSV → ICS Converter
                  </Link>
                </li>
                <li>
                  <Link href="/map/calendar-ics#sample=events" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Try with Sample Events
                  </Link>
                </li>
                <li>
                  <Link href="/ics-tools" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Advanced ICS Tools
                  </Link>
                </li>
                <li>
                  <Link href="/cli" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    CLI Tool
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">📚 Documentation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/csv-to-ics-converter" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    CSV to ICS Guide
                  </Link>
                </li>
                <li>
                  <Link href="/docs/import-ics-google-calendar" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Import to Google Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/docs/import-ics-outlook" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Import to Outlook
                  </Link>
                </li>
                <li>
                  <Link href="/self-host" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Self-Host CalendarMap
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/docs"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
