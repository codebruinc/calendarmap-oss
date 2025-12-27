import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900">CalendarMap</Link>
            <span>/</span>
            <span className="text-gray-900">Privacy</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose max-w-none">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-900 mb-2">🔒 Privacy-first by design</h2>
            <p className="text-green-800">
              CalendarMap processes your CSV files entirely in your browser. Your event data never leaves your device.
            </p>
          </div>

          <h2>What we collect</h2>

          <h3>Browser-only processing</h3>
          <ul>
            <li><strong>Your event data:</strong> Never uploaded to our servers. Processed entirely in your browser using JavaScript.</li>
            <li><strong>Calendar mappings:</strong> Only stored in your browser's URL hash and localStorage if you choose to save them.</li>
            <li><strong>ICS files:</strong> Generated locally in your browser, never sent to our servers.</li>
          </ul>

          <h2>What we don't do</h2>
          <ul>
            <li>❌ Upload your CSV files to servers</li>
            <li>❌ Store your event or schedule data</li>
            <li>❌ Track you across the web</li>
            <li>❌ Require user accounts or logins</li>
            <li>❌ Sell your data to third parties</li>
            <li>❌ Use cookies or tracking</li>
          </ul>

          <h2>Data retention</h2>
          <ul>
            <li><strong>CSV files:</strong> Never stored on our servers</li>
            <li><strong>ICS files:</strong> Generated locally, never stored on servers</li>
            <li><strong>Event mappings:</strong> Only stored locally in your browser</li>
          </ul>

          <h2>Open source transparency</h2>
          <p>
            CalendarMap is fully open source under the MIT license. You can review our code,
            host your own instance, or contribute improvements on{' '}
            <a href="https://github.com/codebruinc/calendarmap-oss" className="text-blue-600 hover:underline">
              GitHub
            </a>.
          </p>

          <h2>CLI tool</h2>
          <p>
            Our command-line tool processes event files entirely on your local machine with no network
            connectivity required. It includes the same calendar conversion and timezone handling
            as the web version.
          </p>

          <h2>Questions or concerns</h2>
          <p>
            If you have questions about this privacy policy, please{' '}
            <a href="https://github.com/codebruinc/calendarmap-oss/issues" className="text-blue-600 hover:underline">
              open an issue on GitHub
            </a>.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
            <p className="text-sm text-gray-600">
              Last updated: December 2024<br/>
              This privacy policy may be updated as we add new features, but our core commitment
              to privacy-first, browser-only processing will remain unchanged.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
