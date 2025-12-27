import Link from 'next/link';
import { ArrowLeft, Upload, MapPin, Download, CheckCircle } from 'lucide-react';
import Script from 'next/script';

export const metadata = {
  title: 'CSV to ICS Converter Guide — CalendarMap',
  description: 'Step-by-step guide to convert CSV files to ICS calendar format using CalendarMap.',
};

export default function CSVToICSConverterPage() {
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Convert CSV to ICS Calendar Format",
    "description": "Convert CSV event files to ICS calendar format using CalendarMap's free online converter. Works with Google Calendar, Outlook, and Apple Calendar.",
    "image": "https://calendarmap.app/og-image.png",
    "totalTime": "PT2M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": {
      "@type": "HowToSupply",
      "name": "CSV file with event data"
    },
    "tool": {
      "@type": "HowToTool",
      "name": "CalendarMap Converter",
      "url": "https://calendarmap.app/map/calendar-ics"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload your CSV file",
        "text": "Visit https://calendarmap.app/map/calendar-ics and click 'Upload CSV' to select your event file. The file should contain columns for event title, start date/time, and optionally end date/time, location, and description.",
        "url": "https://calendarmap.app/map/calendar-ics",
        "image": "https://calendarmap.app/step1.png"
      },
      {
        "@type": "HowToStep",
        "name": "Map your CSV columns",
        "text": "CalendarMap will automatically detect and map your CSV columns to calendar fields. Review the mappings and adjust if needed. Required fields are Title and Start Date.",
        "url": "https://calendarmap.app/map/calendar-ics",
        "image": "https://calendarmap.app/step2.png"
      },
      {
        "@type": "HowToStep",
        "name": "Validate your data",
        "text": "Check the validation panel for any issues with your data. CalendarMap will highlight missing required fields or invalid date formats.",
        "url": "https://calendarmap.app/map/calendar-ics",
        "image": "https://calendarmap.app/step3.png"
      },
      {
        "@type": "HowToStep",
        "name": "Download ICS file",
        "text": "Click 'Export ICS' to download your calendar file. The ICS file can be imported into Google Calendar, Outlook, Apple Calendar, or any calendar application that supports the ICS format.",
        "url": "https://calendarmap.app/map/calendar-ics",
        "image": "https://calendarmap.app/step4.png"
      }
    ]
  };

  return (
    <>
      <Script
        id="howto-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link 
            href="/docs"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Documentation
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              CSV to ICS Converter Guide
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Convert your CSV event files to ICS calendar format in 4 simple steps. Works with all major calendar applications including Google Calendar, Outlook, and Apple Calendar.
            </p>

            {/* Step-by-step guide */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">Upload your CSV file</h2>
                  <p className="text-gray-600 mb-3">
                    Visit <Link href="/map/calendar-ics" className="text-blue-600 hover:underline">calendarmap.app/map/calendar-ics</Link> and click "Upload CSV" to select your event file.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Required columns:</h3>
                    <ul className="list-disc list-inside text-blue-800 space-y-1">
                      <li>Title (event name/summary)</li>
                      <li>Start Date or Start Date/Time</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">Map your CSV columns</h2>
                  <p className="text-gray-600 mb-3">
                    CalendarMap automatically detects and maps your columns to calendar fields. Review and adjust if needed.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Smart auto-detection:</h3>
                    <ul className="list-disc list-inside text-green-800 space-y-1">
                      <li>Recognizes common date formats</li>
                      <li>Detects timezone information</li>
                      <li>Identifies all-day events</li>
                      <li>Maps location and description fields</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">Validate your data</h2>
                  <p className="text-gray-600 mb-3">
                    Check the validation panel for any issues. CalendarMap highlights problems and suggests fixes.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Common validations:</h3>
                    <ul className="list-disc list-inside text-yellow-800 space-y-1">
                      <li>Missing required fields</li>
                      <li>Invalid date formats</li>
                      <li>End time before start time</li>
                      <li>Timezone consistency</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">Download ICS file</h2>
                  <p className="text-gray-600 mb-3">
                    Click "Export ICS" to download your calendar file. Import it into any calendar application.
                  </p>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Compatible with:</h3>
                    <ul className="list-disc list-inside text-purple-800 space-y-1">
                      <li>Google Calendar</li>
                      <li>Microsoft Outlook</li>
                      <li>Apple Calendar</li>
                      <li>Yahoo Calendar</li>
                      <li>Any ICS-compatible app</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick tips */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Quick Tips</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Use consistent date formats</h3>
                    <p className="text-sm text-gray-600">Keep all dates in the same format throughout your CSV</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Include timezone info</h3>
                    <p className="text-sm text-gray-600">Add a timezone column for accurate time conversion</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Mark all-day events</h3>
                    <p className="text-sm text-gray-600">Use TRUE/FALSE in an "All Day" column</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Test with sample data</h3>
                    <p className="text-sm text-gray-600">Try our <Link href="/map/calendar-ics#sample=events" className="text-blue-600 hover:underline">sample converter</Link> first</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <Link
                href="/map/calendar-ics"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <Upload className="w-5 h-5" />
                Start Converting Now
              </Link>
              <p className="mt-3 text-sm text-gray-600">
                No sign-up required • Free for files under 2,000 rows
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}