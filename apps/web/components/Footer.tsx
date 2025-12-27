import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">CalendarMap</h3>
            <p className="text-sm">
              The simplest way to convert CSV events to ICS calendar format.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/map/calendar-ics" className="hover:text-white">Converter</Link></li>
              <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
              <li><Link href="/cli" className="hover:text-white">CLI Tool</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Also Try</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="https://schemamap.app/map?schema=shopify-products" className="hover:text-white">Shopify Products</Link></li>
              <li><Link href="https://schemamap.app/map?schema=shopify-inventory" className="hover:text-white">Shopify Inventory</Link></li>
              <li><Link href="https://schemamap.app/map?schema=stripe-customers" className="hover:text-white">Stripe Customers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Open Source</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="https://github.com/codebruinc/calendarmap" className="hover:text-white">GitHub</Link></li>
              <li><Link href="/self-host" className="hover:text-white">Self-Host</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/for-ai" className="hover:text-white">For AI</Link></li>
              <li><Link href="/ics-tools" className="hover:text-white">Advanced</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p className="mb-3 text-base">
            Built by{' '}
            <a
              href="https://codebru.com"
              target="_blank"
              className="text-blue-400 hover:text-blue-300 font-semibold underline"
            >
              CodeBru
            </a>
            {' '}— Trusted by universities and established companies since 2015
          </p>
          <p className="text-gray-500">&copy; 2025 CalendarMap. MIT Licensed. Built for the community.</p>
        </div>
      </div>
    </footer>
  );
}
