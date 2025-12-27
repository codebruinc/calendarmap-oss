import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, FileText } from 'lucide-react';

export const metadata = {
  title: 'Documentation — CalendarMap',
  description: 'Learn how to convert CSV files to ICS calendar format. Complete guide with examples and troubleshooting.',
  openGraph: {
    title: 'Documentation — CalendarMap',
    description: 'Learn how to convert CSV files to ICS calendar format. Complete guide with examples and troubleshooting.',
    url: 'https://calendarmap.app/docs',
    type: 'website',
    images: [{
      url: 'https://calendarmap.app/og-image.png',
      width: 1200,
      height: 630,
      alt: 'CalendarMap Documentation',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation — CalendarMap',
    description: 'Learn how to convert CSV files to ICS calendar format. Complete guide with examples and troubleshooting.',
    images: ['https://calendarmap.app/og-image.png'],
  },
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CalendarMap
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            CalendarMap Documentation
          </h1>

          {/* Guide Links */}
          <div className="mb-8 grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📘 CSV to ICS Converter</h3>
              <p className="text-blue-700 text-sm mb-3">
                Complete guide for converting CSV to calendar format
              </p>
              <Link 
                href="/docs/csv-to-ics-converter"
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                View Guide →
              </Link>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">📅 Import to Google Calendar</h3>
              <p className="text-green-700 text-sm mb-3">
                How to import your ICS file into Google Calendar
              </p>
              <Link 
                href="/docs/import-ics-google-calendar"
                className="text-green-600 hover:text-green-700 font-semibold text-sm"
              >
                View Guide →
              </Link>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">📧 Import to Outlook</h3>
              <p className="text-purple-700 text-sm mb-3">
                How to import your ICS file into Microsoft Outlook
              </p>
              <Link 
                href="/docs/import-ics-outlook"
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                View Guide →
              </Link>
            </div>
          </div>

          {/* Quick Start */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Start</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                CalendarMap converts CSV files with event data into ICS calendar files that work with Google Calendar, Outlook, Apple Calendar, and other calendar applications.
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Upload your CSV file with event data</li>
                <li>Map your CSV columns to calendar fields</li>
                <li>Validate your data for any issues</li>
                <li>Download your ICS calendar file</li>
              </ol>
            </div>
          </section>

          {/* Required Fields */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Required Fields</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Title</h3>
                  <span className="text-red-500 text-sm">Required</span>
                </div>
                <p className="text-gray-600 text-sm">
                  The event title/summary. Common CSV headers: "title", "event", "summary", "name"
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">Start Date/Time</h3>
                  <span className="text-red-500 text-sm">Required</span>
                </div>
                <p className="text-gray-600 text-sm">
                  When the event starts. Supports various formats including "2025-09-15", "9/15/2025", "Sep 15, 2025"
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Common headers: "start", "start_date", "date", "event_date"
                </p>
              </div>
            </div>
          </section>

          {/* Optional Fields */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Optional Fields</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">End Date/Time</h3>
                <p className="text-gray-600 text-sm">
                  When the event ends. If not provided, creates a 1-hour event.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-gray-600 text-sm">
                  Event location. Can be physical address or virtual meeting link.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 text-sm">
                  Detailed event description or notes.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">All Day</h3>
                <p className="text-gray-600 text-sm">
                  Mark as all-day event. Use "TRUE", "YES", or "1" for all-day.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Timezone</h3>
                <p className="text-gray-600 text-sm">
                  Event timezone. Defaults to UTC if not specified.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Duration</h3>
                <p className="text-gray-600 text-sm">
                  Event duration in minutes. Alternative to end time.
                </p>
              </div>
            </div>
          </section>

          {/* Date Formats */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Supported Date Formats</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Date Examples</h3>
              <ul className="space-y-1 text-sm text-gray-600 font-mono">
                <li>• 2025-09-15</li>
                <li>• 09/15/2025</li>
                <li>• September 15, 2025</li>
                <li>• Sep 15, 2025</li>
                <li>• 15-Sep-2025</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="font-semibold mb-3">Time Examples</h3>
              <ul className="space-y-1 text-sm text-gray-600 font-mono">
                <li>• 10:00 AM</li>
                <li>• 14:30</li>
                <li>• 2:00 PM</li>
                <li>• 09:00</li>
              </ul>
            </div>
          </section>

          {/* Sample CSV */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sample CSV Format</h2>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`Title,Start Date,Start Time,End Date,End Time,Location,Description,All Day
Team Meeting,2025-09-15,10:00 AM,2025-09-15,11:30 AM,Conference Room A,Weekly standup,FALSE
Product Launch,2025-09-18,,,,,Major product release,TRUE
Client Workshop,2025-09-20,2:00 PM,2025-09-20,5:00 PM,Zoom Meeting,Design workshop,FALSE`}
              </pre>
            </div>
            <div className="mt-4">
              <Link 
                href="/map/calendar-ics#sample=events"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <FileText className="w-4 h-4" />
                Try this sample in CalendarMap
              </Link>
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Troubleshooting</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Dates not parsing correctly?</h3>
                <p className="text-yellow-700 text-sm">
                  Make sure your date format is consistent throughout the CSV. Mix of formats can cause parsing issues.
                </p>
              </div>

              <div className="border-l-4 border-red-400 bg-red-50 p-4">
                <h3 className="font-semibold text-red-800 mb-2">Events not showing in calendar?</h3>
                <p className="text-red-700 text-sm">
                  Check that your events have both a title and start date. These are required for valid ICS files.
                </p>
              </div>

              <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Timezone issues?</h3>
                <p className="text-blue-700 text-sm">
                  If not specified, events default to UTC. Add a timezone column with values like "America/New_York" for proper timezone handling.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}