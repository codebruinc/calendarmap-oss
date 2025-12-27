import Link from 'next/link';
import Script from 'next/script';

export default function ImportICSGoogleCalendarPage() {
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Import ICS Calendar File into Google Calendar",
    "description": "Step-by-step guide to import ICS calendar files generated from CSV into Google Calendar",
    "image": "https://calendarmap.app/google-calendar-import.jpg",
    "totalTime": "PT5M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "ICS calendar file"
      },
      {
        "@type": "HowToSupply", 
        "name": "Google account"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Web browser"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Convert your CSV to ICS format",
        "text": "Use CalendarMap to convert your CSV events to ICS calendar format",
        "url": "https://calendarmap.app/docs/import-ics-google-calendar#step-1",
        "image": "https://calendarmap.app/csv-to-ics-step.jpg"
      },
      {
        "@type": "HowToStep", 
        "name": "Open Google Calendar",
        "text": "Go to calendar.google.com and sign in to your Google account",
        "url": "https://calendarmap.app/docs/import-ics-google-calendar#step-2",
        "image": "https://calendarmap.app/google-calendar-homepage.jpg"
      },
      {
        "@type": "HowToStep",
        "name": "Access Settings",
        "text": "Click the gear icon in the top right and select 'Settings' from the dropdown menu",
        "url": "https://calendarmap.app/docs/import-ics-google-calendar#step-3",
        "image": "https://calendarmap.app/google-calendar-settings.jpg"
      },
      {
        "@type": "HowToStep",
        "name": "Import & Export",
        "text": "In the left sidebar, click 'Import & export'",
        "url": "https://calendarmap.app/docs/import-ics-google-calendar#step-4"
      },
      {
        "@type": "HowToStep",
        "name": "Select your ICS file",
        "text": "Click 'Select file from your computer' and choose your .ics file downloaded from CalendarMap",
        "url": "https://calendarmap.app/docs/import-ics-google-calendar#step-5"
      },
      {
        "@type": "HowToStep",
        "name": "Choose destination calendar",
        "text": "Select which Google Calendar you want to import the events into (or create a new one)",
        "url": "https://calendarmap.app/docs/import-ics-google-calendar#step-6"
      },
      {
        "@type": "HowToStep",
        "name": "Import events",
        "text": "Click 'Import' to add all events from your ICS file to your Google Calendar",
        "url": "https://calendarmap.app/docs/import-ics-google-calendar#step-7"
      }
    ],
    "author": {
      "@type": "Organization",
      "name": "CalendarMap",
      "url": "https://calendarmap.app"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "CalendarMap",
      "url": "https://calendarmap.app"
    }
  };

  return (
    <>
      <Script
        id="howto-google-calendar-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-gray-900">CalendarMap</Link>
              <span>/</span>
              <Link href="/docs" className="hover:text-gray-900">Docs</Link>
              <span>/</span>
              <span className="text-gray-900">Import ICS to Google Calendar</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900">How to Import ICS into Google Calendar</h1>
            <p className="text-gray-600 mt-2">
              Step-by-step guide to import your converted CSV events into Google Calendar
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose max-w-none">
            
            {/* Quick Overview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">📋 Quick Overview</h2>
              <p className="text-blue-800 mb-3">
                This guide shows you how to import ICS calendar files into Google Calendar. 
                The entire process takes about 5 minutes.
              </p>
              <div className="text-sm text-blue-700">
                <strong>What you'll need:</strong> An ICS file (from CalendarMap) and a Google account
              </div>
            </div>

            {/* Step 1 */}
            <section className="mb-8" id="step-1">
              <h2 className="text-2xl font-bold mb-4">Step 1: Convert Your CSV to ICS Format</h2>
              <p className="mb-4">
                First, you need to convert your CSV events to ICS calendar format using CalendarMap:
              </p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Go to <Link href="/map/calendar-ics" className="text-blue-600 hover:underline font-medium">CalendarMap CSV to ICS Converter</Link></li>
                <li>Upload your CSV file with events</li>
                <li>Map your CSV columns to calendar fields</li>
                <li>Download the generated ICS file</li>
              </ol>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>💡 Tip:</strong> Make sure your CSV has at minimum a title and start date/time column. 
                  CalendarMap will automatically detect common column names like "Title", "Event", "Start", "Date", etc.
                </p>
              </div>
            </section>

            {/* Step 2 */}
            <section className="mb-8" id="step-2">
              <h2 className="text-2xl font-bold mb-4">Step 2: Open Google Calendar</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Go to <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">calendar.google.com</a></li>
                <li>Sign in with your Google account if not already logged in</li>
                <li>Wait for Google Calendar to load completely</li>
              </ol>
            </section>

            {/* Step 3 */}
            <section className="mb-8" id="step-3">
              <h2 className="text-2xl font-bold mb-4">Step 3: Access Calendar Settings</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Look for the <strong>gear/settings icon</strong> (⚙️) in the top-right corner of Google Calendar</li>
                <li>Click on the gear icon to open the dropdown menu</li>
                <li>Select <strong>"Settings"</strong> from the dropdown</li>
              </ol>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Note:</strong> If you don't see a gear icon, try refreshing the page or switching to the web version of Google Calendar.
                </p>
              </div>
            </section>

            {/* Step 4 */}
            <section className="mb-8" id="step-4">
              <h2 className="text-2xl font-bold mb-4">Step 4: Navigate to Import & Export</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>In the Settings page, look for the left sidebar navigation</li>
                <li>Click on <strong>"Import & export"</strong> in the left sidebar</li>
                <li>This will take you to the import/export options page</li>
              </ol>
            </section>

            {/* Step 5 */}
            <section className="mb-8" id="step-5">
              <h2 className="text-2xl font-bold mb-4">Step 5: Select Your ICS File</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>In the Import section, click <strong>"Select file from your computer"</strong></li>
                <li>Browse to find the ICS file you downloaded from CalendarMap (usually in your Downloads folder)</li>
                <li>Select the .ics file and click "Open"</li>
                <li>The file name should appear next to the file selection button</li>
              </ol>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>✅ File Format:</strong> Make sure your file ends with .ics extension. 
                  Google Calendar accepts ICS/iCal format files.
                </p>
              </div>
            </section>

            {/* Step 6 */}
            <section className="mb-8" id="step-6">
              <h2 className="text-2xl font-bold mb-4">Step 6: Choose Destination Calendar</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Below the file selection, you'll see <strong>"Add to calendar"</strong> dropdown</li>
                <li>Choose which Google Calendar you want to import the events into:</li>
                <ul className="list-disc list-inside ml-6 space-y-1 mt-2">
                  <li><strong>Your main calendar</strong> (usually your email address)</li>
                  <li><strong>An existing secondary calendar</strong></li>
                  <li><strong>Create a new calendar</strong> for these imported events</li>
                </ul>
              </ol>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Recommendation:</strong> Create a new calendar specifically for imported events. 
                  This makes it easier to manage and distinguish from your regular calendar entries.
                </p>
              </div>
            </section>

            {/* Step 7 */}
            <section className="mb-8" id="step-7">
              <h2 className="text-2xl font-bold mb-4">Step 7: Import Your Events</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Once you've selected your file and destination calendar, click the <strong>"Import"</strong> button</li>
                <li>Google Calendar will process your ICS file</li>
                <li>You'll see a confirmation message showing how many events were imported</li>
                <li>Click <strong>"View calendar"</strong> or navigate back to your main calendar view</li>
              </ol>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>🎉 Success!</strong> Your events are now imported. 
                  They should appear on your Google Calendar according to their scheduled dates and times.
                </p>
              </div>
            </section>

            {/* Troubleshooting */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">🔧 Troubleshooting</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Events not showing up?</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Check if events are in the past - Google Calendar might not display them by default</li>
                    <li>Verify the destination calendar is visible (check the left sidebar)</li>
                    <li>Look for events in different date ranges using calendar navigation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Import failed?</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Make sure your ICS file is not corrupted (try re-downloading from CalendarMap)</li>
                    <li>Check that the file is actually in ICS format (.ics extension)</li>
                    <li>Try importing a smaller subset of events to isolate the issue</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Time zones wrong?</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Check your Google Calendar timezone settings</li>
                    <li>When converting with CalendarMap, specify the correct timezone</li>
                    <li>Events may need to be recreated with the correct timezone information</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Next Steps */}
            <section className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-3">🎯 What's Next?</h2>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Share your calendar:</strong> Google Calendar makes it easy to share imported events with others</li>
                <li>• <strong>Set up notifications:</strong> Configure email or mobile alerts for your imported events</li>
                <li>• <strong>Sync across devices:</strong> Your imported events will automatically sync to the Google Calendar app</li>
                <li>• <strong>Need help with CSV conversion?</strong> Check out our <Link href="/docs/csv-to-ics-converter" className="text-green-600 hover:text-green-800 underline">complete CSV to ICS guide</Link></li>
              </ul>
            </section>

          </div>
        </main>
      </div>
    </>
  );
}