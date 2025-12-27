import { Copy, Download, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function CLIPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900">CalendarMap</Link>
            <span>/</span>
            <span className="text-gray-900">CLI</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">CLI Tool</h1>
          <p className="text-gray-600 mt-2">
            Convert CSV files to ICS calendar format from the command line
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Installation */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Download className="w-6 h-6" />
              Installation
            </h2>
            
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Install globally with npm:</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  npm install -g calendarmap-cli
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Verify installation:</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  calendarmap --version
                </div>
              </div>
            </div>
          </section>

          {/* Basic Usage */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Terminal className="w-6 h-6" />
              Basic Usage
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">1. Generate mapping from your CSV headers:</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  calendarmap guess --schema calendar-ics &lt; events.csv &gt; mapping.json
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">2. Convert CSV to ICS using the mapping:</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  calendarmap map --schema calendar-ics --mapping mapping.json &lt; events.csv &gt; calendar.ics
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Alternative: Use files instead of pipes:</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  {`calendarmap guess --schema calendar-ics --input events.csv --output mapping.json
calendarmap map --schema calendar-ics --mapping mapping.json --input events.csv --output calendar.ics`}
                </div>
              </div>
            </div>
          </section>

          {/* Commands */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Commands</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-mono font-medium">guess</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Auto-detect CSV columns and generate mapping file
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-mono font-medium">map</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Convert CSV to ICS using field mapping
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-mono font-medium">validate</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Check CSV data for issues before conversion
                </p>
              </div>
            </div>
          </section>

          {/* Examples */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Examples</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Conference Schedule</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  {`# Convert conference sessions to calendar
calendarmap guess --schema calendar-ics < conference.csv > conf-mapping.json
calendarmap map --schema calendar-ics --mapping conf-mapping.json < conference.csv > conference2025.ics`}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Team Calendar with Validation</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  {`# Process team events with validation
calendarmap guess --schema calendar-ics --input team-events.csv --output team-mapping.json
calendarmap validate --schema calendar-ics --mapping team-mapping.json --input team-events.csv
calendarmap map --schema calendar-ics --mapping team-mapping.json --input team-events.csv --output team.ics`}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Batch Processing Script</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  {`#!/bin/bash
# Convert all CSV files in directory
for file in *.csv; do
  name=$(basename "$file" .csv)
  calendarmap guess --schema calendar-ics < "$file" > "$name-mapping.json"
  calendarmap map --schema calendar-ics --mapping "$name-mapping.json" < "$file" > "$name.ics"
done`}
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Why Use the CLI?</h2>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <div>
                  <strong className="font-medium">Automation</strong>
                  <p className="text-gray-600 text-sm">Integrate into scripts and workflows</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <div>
                  <strong className="font-medium">Batch Processing</strong>
                  <p className="text-gray-600 text-sm">Convert multiple CSV files at once</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <div>
                  <strong className="font-medium">Large Files</strong>
                  <p className="text-gray-600 text-sm">No size limits on CSV files</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <div>
                  <strong className="font-medium">Privacy</strong>
                  <p className="text-gray-600 text-sm">All processing happens locally</p>
                </div>
              </li>
            </ul>
          </section>

          {/* Get Started */}
          <section className="bg-gray-100 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-3">Ready to get started?</h2>
            <p className="text-gray-600 mb-4">
              Install the CLI tool and start converting your CSV files to calendar format
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm inline-block">
              npm install -g calendarmap-cli
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}