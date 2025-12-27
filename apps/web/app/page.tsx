import Link from 'next/link';
import { ArrowRight, Shield, Calendar, Zap, CheckCircle, Download } from 'lucide-react';
import EnterpriseContactForm from '../components/EnterpriseContactForm';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
            Convert CSV to ICS Calendar in 30 seconds
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Drop your CSV events, get an ICS calendar file. Works with Google Calendar & Outlook. No login. Runs in your browser.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/map/calendar-ics"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2 transition-colors"
            >
              Open CSV → ICS Converter <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/map/calendar-ics#sample=events"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2 transition-colors"
            >
              Try with Sample Events <Calendar className="w-5 h-5" />
            </Link>
          </div>

          {/* Trust Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm">100% Private (runs in browser)</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span className="text-sm">Free up to 2,000 events</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm">RFC 5545 Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why CalendarMap?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-4 inline-block mb-4">
                <Calendar className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Field Mapping</h3>
              <p className="text-gray-600">
                Automatically detects Title, Start, End, Location, and other calendar fields from your CSV headers
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="bg-green-100 rounded-lg p-4 inline-block mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Date & Timezone Support</h3>
              <p className="text-gray-600">
                Handles all-day events, timed events, timezones, and various date formats automatically
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="bg-purple-100 rounded-lg p-4 inline-block mb-4">
                <Download className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Universal Compatibility</h3>
              <p className="text-gray-600">
                Works with Google Calendar, Outlook, Apple Calendar, and any app that supports ICS files
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-3">1</div>
              <h3 className="font-semibold mb-2">Upload CSV</h3>
              <p className="text-gray-600 text-sm">Drop your events CSV file with dates, titles, and details</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-3">2</div>
              <h3 className="font-semibold mb-2">Map Fields</h3>
              <p className="text-gray-600 text-sm">We auto-detect columns, you can adjust if needed</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-3">3</div>
              <h3 className="font-semibold mb-2">Validate</h3>
              <p className="text-gray-600 text-sm">Check for date issues, missing fields, and formatting</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-3">4</div>
              <h3 className="font-semibold mb-2">Download ICS</h3>
              <p className="text-gray-600 text-sm">Get your calendar file ready for import</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 bg-white" id="enterprise">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Teams & Organizations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop doing manual CSV imports. We can automate this entire workflow for your team.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-xl p-8 text-white mb-12">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Calendar Automation for Organizations
              </h3>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Who it's for:</h4>
                  <ul className="space-y-2 text-blue-100">
                    <li>• Universities and school districts</li>
                    <li>• Corporate operations teams</li>
                    <li>• Event organizers</li>
                    <li>• HR and facilities managers</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">What we build:</h4>
                  <ul className="space-y-2 text-blue-100">
                    <li>• Direct integration from Google Sheets or your HR system</li>
                    <li>• Automatic sync to staff calendars</li>
                    <li>• No more manual imports or errors</li>
                    <li>• Recurring updates handled automatically</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-100 text-center">
                  <strong className="text-white">Built by CodeBru</strong> — Trusted by universities and established companies since 2015
                </p>
              </div>

              <div className="text-center">
                <p className="text-blue-100 mb-4">
                  Real examples: Schools syncing class schedules, companies automating facility bookings, event teams managing recurring programs.
                </p>
              </div>
            </div>
          </div>

          <EnterpriseContactForm source="homepage" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to convert your events?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            No signup required. Your data never leaves your browser.
          </p>
          <Link
            href="/map/calendar-ics"
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 transition-colors"
          >
            Start Converting Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}