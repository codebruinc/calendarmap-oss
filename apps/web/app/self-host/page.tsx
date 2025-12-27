import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Self-Host CalendarMap — Deploy Your Own Instance',
  description: 'Deploy CalendarMap on your own infrastructure for complete data privacy and control',
  openGraph: {
    title: 'Self-Host CalendarMap',
    description: 'Deploy CalendarMap on your own infrastructure for complete data privacy',
    url: 'https://calendarmap.app/self-host',
    siteName: 'CalendarMap',
    type: 'article',
  },
};

export default function SelfHostPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900">CalendarMap</Link>
            <span>/</span>
            <span className="text-gray-900">Self-Host</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Self-Host CalendarMap</h1>
          <p className="text-gray-600 mt-2">Deploy on your infrastructure for complete data privacy</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-900 mb-2">🔒 Maximum Privacy</h2>
          <p className="text-green-800">
            Self-hosting ensures your event and schedule data never leaves your infrastructure. 
            Perfect for organizations with strict data residency requirements.
          </p>
        </div>

        <div className="prose max-w-none">
          <h2>Quick Deploy Options</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8 not-prose">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Vercel (Recommended)</h3>
              <p className="text-gray-600 mb-4">One-click deploy with automatic CI/CD</p>
              <a 
                href="https://vercel.com/new/clone?repository-url=https://github.com/codebruinc/calendarmap"
                className="bg-black text-white px-4 py-2 rounded inline-block hover:bg-gray-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Deploy to Vercel
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">Cloudflare Pages</h3>
              <p className="text-gray-600 mb-4">Global edge network deployment</p>
              <a 
                href="https://developers.cloudflare.com/pages/get-started"
                className="bg-orange-500 text-white px-4 py-2 rounded inline-block hover:bg-orange-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Deploy to Cloudflare
              </a>
            </div>
          </div>

          <h2>Manual Installation</h2>
          
          <h3>Prerequisites</h3>
          <ul>
            <li>Node.js 18+ and npm/yarn/pnpm</li>
            <li>Git</li>
            <li>A hosting platform (Vercel, Netlify, Cloudflare Pages, or any static host)</li>
          </ul>

          <h3>Step 1: Clone the Repository</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`git clone https://github.com/codebruinc/calendarmap.git
cd calendarmap`}</code>
          </pre>

          <h3>Step 2: Install Dependencies</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`npm install
# or
yarn install
# or
pnpm install`}</code>
          </pre>

          <h3>Step 3: Build the Application</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`npm run build
# This creates an optimized production build in the 'out' directory`}</code>
          </pre>

          <h3>Step 4: Deploy the Static Files</h3>
          <p>
            The <code>out</code> directory contains static HTML/CSS/JS files that can be hosted anywhere:
          </p>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Option A: Local Preview</h4>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm">
              <code>npx serve -s out</code>
            </pre>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Option B: Deploy to Nginx</h4>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm">
              <code>{`# Copy files to your web root
cp -r out/* /var/www/html/

# Nginx config
location / {
  try_files $uri $uri/ /index.html;
}`}</code>
            </pre>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Option C: Docker Container</h4>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm">
              <code>{`FROM nginx:alpine
COPY out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}</code>
            </pre>
          </div>

          <h2>Configuration Options</h2>
          
          <h3>Environment Variables</h3>
          <p>For optional features like Stripe payments (Large Event Pass):</p>
          
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`# .env.local (optional - only if enabling payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
ENABLE_STRIPE_PAYMENTS=true`}</code>
          </pre>

          <h3>Customization</h3>
          <ul>
            <li><strong>Branding:</strong> Edit <code>app/layout.tsx</code> for site title and metadata</li>
            <li><strong>Limits:</strong> Adjust event limits in <code>app/map/MapperComponent.tsx</code></li>
            <li><strong>Templates:</strong> Customize calendar fields in <code>packages/engine/src/templates/</code></li>
          </ul>

          <h2>Security Considerations</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-yellow-900 font-semibold mb-3">⚠️ Important Security Notes</h3>
            <ul className="space-y-2 text-yellow-800">
              <li>• All CSV to ICS conversion happens in the browser - no server-side processing</li>
              <li>• Configure CSP headers to prevent XSS attacks</li>
              <li>• Use HTTPS in production</li>
              <li>• Review and audit dependencies regularly</li>
              <li>• Consider adding authentication if needed for your use case</li>
            </ul>
          </div>

          <h2>Support</h2>
          
          <div className="grid md:grid-cols-2 gap-6 not-prose">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">📚 Documentation</h3>
              <p className="text-gray-600 mb-3">Check our GitHub README for detailed docs</p>
              <a 
                href="https://github.com/codebruinc/calendarmap#readme"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Documentation
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-3">🐛 Issues & Features</h3>
              <p className="text-gray-600 mb-3">Report bugs or request features</p>
              <a 
                href="https://github.com/codebruinc/calendarmap/issues"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Issues
              </a>
            </div>
          </div>

          <h2>License</h2>
          <p>
            CalendarMap is MIT licensed. You're free to use, modify, and distribute it for any purpose.
          </p>
        </div>
      </main>
    </div>
  );
}