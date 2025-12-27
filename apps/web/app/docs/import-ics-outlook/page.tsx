import Link from 'next/link';
import Script from 'next/script';

export default function ImportICSOutlookPage() {
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Import ICS Calendar File into Outlook",
    "description": "Step-by-step guide to import ICS calendar files generated from CSV into Microsoft Outlook (Web and Desktop)",
    "image": "https://calendarmap.app/outlook-import.jpg",
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
        "name": "Microsoft account"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Web browser or Outlook desktop app"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Convert your CSV to ICS format",
        "text": "Use CalendarMap to convert your CSV events to ICS calendar format",
        "url": "https://calendarmap.app/docs/import-ics-outlook#step-1",
        "image": "https://calendarmap.app/csv-to-ics-step.jpg"
      },
      {
        "@type": "HowToStep", 
        "name": "Open Outlook Calendar",
        "text": "Go to outlook.com or open Outlook desktop app and navigate to Calendar",
        "url": "https://calendarmap.app/docs/import-ics-outlook#step-2",
        "image": "https://calendarmap.app/outlook-calendar.jpg"
      },
      {
        "@type": "HowToStep",
        "name": "Access Import Settings",
        "text": "Click on 'Add calendar' or 'Import calendar' option in the interface",
        "url": "https://calendarmap.app/docs/import-ics-outlook#step-3"
      },
      {
        "@type": "HowToStep",
        "name": "Choose import method",
        "text": "Select 'Upload from file' or similar import option",
        "url": "https://calendarmap.app/docs/import-ics-outlook#step-4"
      },
      {
        "@type": "HowToStep",
        "name": "Select your ICS file",
        "text": "Click 'Browse' and choose your .ics file downloaded from CalendarMap",
        "url": "https://calendarmap.app/docs/import-ics-outlook#step-5"
      },
      {
        "@type": "HowToStep",
        "name": "Configure import settings",
        "text": "Choose destination calendar and import preferences",
        "url": "https://calendarmap.app/docs/import-ics-outlook#step-6"
      },
      {
        "@type": "HowToStep",
        "name": "Complete the import",
        "text": "Click 'Import' to add all events from your ICS file to Outlook Calendar",
        "url": "https://calendarmap.app/docs/import-ics-outlook#step-7"
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
        id="howto-outlook-structured-data"
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
              <span className="text-gray-900">Import ICS to Outlook</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900">How to Import ICS into Outlook</h1>
            <p className="text-gray-600 mt-2">
              Step-by-step guide to import your converted CSV events into Microsoft Outlook
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose max-w-none">
            
            {/* Platform Selection */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">📋 Choose Your Platform</h2>
              <p className="text-blue-800 mb-3">
                This guide covers importing ICS files into both Outlook Web (outlook.com) and Outlook Desktop app.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white border border-blue-200 rounded p-3">
                  <h3 className="font-semibold text-blue-900">🌐 Outlook Web (Recommended)</h3>
                  <p className="text-sm text-blue-700">Use outlook.com in your browser - works on any device</p>
                </div>
                <div className="bg-white border border-blue-200 rounded p-3">
                  <h3 className="font-semibold text-blue-900">💻 Outlook Desktop</h3>
                  <p className="text-sm text-blue-700">Microsoft Outlook application (Windows/Mac)</p>
                </div>
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
                  <strong>💡 Tip:</strong> Ensure your CSV has columns for event title and start date/time. 
                  CalendarMap automatically detects common headers like "Subject", "Title", "Start Time", "Date", etc.
                </p>
              </div>
            </section>

            {/* Step 2 */}
            <section className="mb-8" id="step-2">
              <h2 className="text-2xl font-bold mb-4">Step 2: Open Outlook Calendar</h2>
              
              {/* Web Version */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-800">🌐 Outlook Web (outlook.com)</h3>
                <ol className="list-decimal list-inside space-y-2 mb-4">
                  <li>Go to <a href="https://outlook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">outlook.com</a></li>
                  <li>Sign in with your Microsoft account</li>
                  <li>Click on <strong>"Calendar"</strong> in the left navigation or app switcher</li>
                  <li>Wait for the calendar interface to load completely</li>
                </ol>
              </div>

              {/* Desktop Version */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-3 text-green-800">💻 Outlook Desktop App</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Open the Microsoft Outlook application on your computer</li>
                  <li>Navigate to the <strong>Calendar</strong> view (press Ctrl+2 or Cmd+2)</li>
                  <li>Ensure you're connected to your Microsoft account</li>
                </ol>
              </div>
            </section>

            {/* Step 3 - Web */}
            <section className="mb-8" id="step-3">
              <h2 className="text-2xl font-bold mb-4">Step 3: Access Import Options</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Web Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800">🌐 Outlook Web</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Look for <strong>"Add calendar"</strong> in the left sidebar</li>
                    <li>Click the <strong>"+"</strong> icon or "Add calendar" button</li>
                    <li>Select <strong>"Upload from file"</strong> from the dropdown options</li>
                  </ol>
                </div>

                {/* Desktop Instructions */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-green-800">💻 Outlook Desktop</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Go to <strong>File</strong> menu at the top</li>
                    <li>Select <strong>"Open & Export"</strong></li>
                    <li>Choose <strong>"Import/Export"</strong> from the submenu</li>
                    <li>Select <strong>"Import an iCalendar (.ics) or vCalendar file"</strong></li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Step 4 */}
            <section className="mb-8" id="step-4">
              <h2 className="text-2xl font-bold mb-4">Step 4: Select Your ICS File</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">For Both Platforms:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Click <strong>"Browse"</strong> or <strong>"Choose file"</strong> button</li>
                    <li>Navigate to where you saved the ICS file (typically Downloads folder)</li>
                    <li>Select your .ics file downloaded from CalendarMap</li>
                    <li>Click <strong>"Open"</strong> to select the file</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ File Location:</strong> If you can't find your ICS file, check your browser's default download location. 
                    The file should have a .ics extension and the name you chose when downloading from CalendarMap.
                  </p>
                </div>
              </div>
            </section>

            {/* Step 5 */}
            <section className="mb-8" id="step-5">
              <h2 className="text-2xl font-bold mb-4">Step 5: Configure Import Settings</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Web Settings */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800">🌐 Outlook Web Options</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Calendar name:</strong> Enter a name for the imported calendar</li>
                    <li>• <strong>Color:</strong> Choose a color to distinguish imported events</li>
                    <li>• <strong>Import to:</strong> Select existing calendar or create new one</li>
                  </ul>
                </div>

                {/* Desktop Settings */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-green-800">💻 Outlook Desktop Options</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Import options:</strong> Choose how to handle duplicates</li>
                    <li>• <strong>Calendar folder:</strong> Select destination calendar</li>
                    <li>• <strong>Event details:</strong> Preview imported events before confirming</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-800">
                  <strong>💡 Recommendation:</strong> Create a new calendar specifically for imported events 
                  (e.g., "Imported Events" or "CSV Calendar") to keep them organized and separate from your regular calendar.
                </p>
              </div>
            </section>

            {/* Step 6 */}
            <section className="mb-8" id="step-6">
              <h2 className="text-2xl font-bold mb-4">Step 6: Complete the Import</h2>
              
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Review your import settings and file selection</li>
                <li>Click <strong>"Import"</strong> or <strong>"OK"</strong> to start the import process</li>
                <li>Wait for Outlook to process your ICS file (this may take a few moments)</li>
                <li>You should see a confirmation message indicating successful import</li>
                <li>The message will typically show how many events were imported</li>
              </ol>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>🎉 Success!</strong> Your events are now imported into Outlook. 
                  Navigate to your calendar view to see the imported events on their scheduled dates.
                </p>
              </div>
            </section>

            {/* Verification */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">✅ Verify Your Import</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Check Your Events:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Navigate to the date range where your events should appear</li>
                    <li>Look for events in your newly created or selected calendar</li>
                    <li>Verify event details like titles, times, and descriptions</li>
                    <li>Check that time zones are displaying correctly</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Calendar Visibility:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Ensure the imported calendar is checked/visible in your calendar list</li>
                    <li>You can toggle calendar visibility on/off in the left sidebar</li>
                    <li>Each calendar can have its own color for easy identification</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">🔧 Troubleshooting</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Import failed or no events visible?</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Verify the ICS file isn't corrupted - try re-downloading from CalendarMap</li>
                    <li>Check that the file has the correct .ics extension</li>
                    <li>Ensure the imported calendar is visible/checked in your calendar list</li>
                    <li>Look for events in different date ranges - they might be in the past or future</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Events showing at wrong times?</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Check your Outlook timezone settings (File &gt; Options &gt; Calendar &gt; Time zones)</li>
                    <li>When creating the ICS file in CalendarMap, ensure correct timezone selection</li>
                    <li>Some events may need timezone adjustment after import</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Duplicate events after import?</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Outlook may not automatically detect duplicates during import</li>
                    <li>You can manually delete duplicate events or entire imported calendar</li>
                    <li>For future imports, consider creating a fresh calendar each time</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Desktop app-specific issues?</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Ensure Outlook is fully updated to the latest version</li>
                    <li>Try importing through Outlook Web first to isolate the issue</li>
                    <li>Restart Outlook after importing to refresh the calendar view</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Alternative Methods */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">🔄 Alternative Import Methods</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-blue-800">Double-click Method (Desktop)</h3>
                  <p className="text-sm text-blue-700 mb-2">
                    On Windows, you can simply double-click your .ics file to open it directly in Outlook.
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                    <li>Navigate to your downloaded ICS file in File Explorer</li>
                    <li>Double-click the .ics file</li>
                    <li>Outlook will open and prompt you to import the events</li>
                    <li>Click "Import" to add events to your default calendar</li>
                  </ol>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-purple-800">Email Method</h3>
                  <p className="text-sm text-purple-700">
                    You can email the ICS file to yourself and import from the email attachment in Outlook.
                  </p>
                </div>
              </div>
            </section>

            {/* Next Steps */}
            <section className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-3">🎯 What's Next?</h2>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Mobile sync:</strong> Your imported events will automatically sync to Outlook mobile apps</li>
                <li>• <strong>Meeting invitations:</strong> Convert imported events to meeting requests if needed</li>
                <li>• <strong>Recurring events:</strong> Set up recurring patterns for repeating imported events</li>
                <li>• <strong>Sharing:</strong> Share your imported calendar with colleagues or family members</li>
                <li>• <strong>Need help with CSV conversion?</strong> Check out our <Link href="/docs/csv-to-ics-converter" className="text-green-600 hover:text-green-800 underline">complete CSV to ICS guide</Link></li>
              </ul>
            </section>

          </div>
        </main>
      </div>
    </>
  );
}