'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Merge, AlertCircle, CheckCircle } from 'lucide-react';

export default function ICSToolsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedContent, setMergedContent] = useState<string>('');
  const [stats, setStats] = useState<{
    totalEvents: number;
    duplicatesRemoved: number;
    filesProcessed: number;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setError('');
    setStats(null);
    setMergedContent('');
  };

  const parseICSFile = async (file: File): Promise<{ events: any[], raw: string }> => {
    const content = await file.text();
    const events: any[] = [];
    
    // Simple ICS parser - extract events
    const eventMatches = Array.from(content.matchAll(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g));
    
    for (const match of eventMatches) {
      const eventContent = match[0];
      const uid = eventContent.match(/UID:(.+)/)?.[1]?.trim();
      const dtstart = eventContent.match(/DTSTART[^:]*:(.+)/)?.[1]?.trim();
      const summary = eventContent.match(/SUMMARY:(.+)/)?.[1]?.trim();
      
      events.push({
        uid,
        dtstart,
        summary,
        raw: eventContent,
        dedupKey: `${uid || 'no-uid'}_${dtstart || 'no-dtstart'}`
      });
    }
    
    return { events, raw: content };
  };

  const mergeAndDeduplicate = useCallback(async () => {
    if (files.length === 0) {
      setError('Please select ICS files to merge');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const allEvents: any[] = [];
      const seenEvents = new Set<string>();
      let totalEventsCount = 0;
      
      // Parse all files
      for (const file of files) {
        const { events } = await parseICSFile(file);
        totalEventsCount += events.length;
        
        for (const event of events) {
          if (!seenEvents.has(event.dedupKey)) {
            seenEvents.add(event.dedupKey);
            allEvents.push(event);
          }
        }
      }
      
      const duplicatesRemoved = totalEventsCount - allEvents.length;
      
      // Build merged ICS content
      let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CalendarMap//ICS Merge Tool//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Merged Calendar
X-WR-TIMEZONE:UTC
`;

      // Add all unique events
      for (const event of allEvents) {
        icsContent += event.raw + '\n';
      }
      
      icsContent += 'END:VCALENDAR';
      
      setMergedContent(icsContent);
      setStats({
        totalEvents: allEvents.length,
        duplicatesRemoved,
        filesProcessed: files.length
      });
      
    } catch (err) {
      setError('Error processing ICS files: ' + (err as Error).message);
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const downloadMergedFile = () => {
    const blob = new Blob([mergedContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged_calendar_${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              ICS Merge & Deduplication Tool
            </h1>
            <p className="text-gray-600">
              Merge multiple ICS calendar files and automatically remove duplicate events based on UID and start time.
            </p>
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700 mb-2 block">
                Select ICS Files to Merge
              </span>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".ics,.ical,.ifb,.icalendar"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    ICS files up to 10MB each
                  </p>
                </div>
              </div>
            </label>

            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h3>
                <ul className="space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Merge Button */}
          <div className="mb-8">
            <button
              onClick={mergeAndDeduplicate}
              disabled={files.length === 0 || processing}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Merge className="w-5 h-5" />
              {processing ? 'Processing...' : 'Merge & Deduplicate'}
            </button>
          </div>

          {/* Results Section */}
          {stats && (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">Merge Complete!</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-green-600">Files Processed</p>
                    <p className="text-2xl font-bold text-green-900">{stats.filesProcessed}</p>
                  </div>
                  <div>
                    <p className="text-green-600">Unique Events</p>
                    <p className="text-2xl font-bold text-green-900">{stats.totalEvents}</p>
                  </div>
                  <div>
                    <p className="text-green-600">Duplicates Removed</p>
                    <p className="text-2xl font-bold text-green-900">{stats.duplicatesRemoved}</p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={downloadMergedFile}
                  className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Merged Calendar
                </button>
              </div>

              {/* Preview Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview (first 1000 characters):</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-xs text-gray-600 overflow-x-auto">
                  {mergedContent.substring(0, 1000)}...
                </pre>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">How it works</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Select multiple ICS calendar files to merge</li>
              <li>The tool will combine all events from all files</li>
              <li>Duplicate events are identified by matching UID and DTSTART values</li>
              <li>Only unique events are kept in the final merged calendar</li>
              <li>Download the clean, deduplicated ICS file</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}