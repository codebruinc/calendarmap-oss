'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import * as Papa from 'papaparse';
import {
  templates,
  guessMapping,
  validateRows,
  generateICS,
  Template,
  GuessMappingResult,
  ValidationResult,
  ICSEvent
} from '@calendarmap/engine';
import Link from 'next/link';
import TimezonePicker from '../../components/TimezonePicker';

// No file size limits in OSS version
const MAX_FILE_SIZE_MB = 100;

export default function MapperComponent() {
  const searchParams = useSearchParams();
  const schema = searchParams.get('schema') || 'calendar-ics';
  const template = templates[schema as keyof typeof templates] as Template;

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<GuessMappingResult>({});
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [transforms, setTransforms] = useState<Record<string, string[]>>({});
  const [defaultTimezone, setDefaultTimezone] = useState<string>('UTC');

  // Load sample CSV if specified in URL hash
  useEffect(() => {
    if (!template) return;

    const checkAndLoadSample = () => {
      if (typeof window === 'undefined') return;

      const hash = window.location.hash;

      if (hash.includes('#sample=')) {
        const sampleType = hash.split('#sample=')[1];

        // Inline 5-row samples for instant loading
        const sampleData = {
        'products': [
          { 'Product Title': 'Wireless Headphones', 'Handle': 'wireless-headphones', 'Status': 'active', 'Published': 'TRUE', 'SKU': 'WH001', 'Price': '89.99', 'Description': 'Premium wireless headphones', 'Vendor': 'AudioTech', 'Category': 'Electronics', 'Stock': '50', 'Inventory Policy': 'continue' },
          { 'Product Title': 'Coffee Mug', 'Handle': 'coffee-mug-ceramic', 'Status': 'active', 'Published': 'FALSE', 'SKU': 'MUG002', 'Price': '12.50', 'Description': 'Ceramic coffee mug', 'Vendor': 'HomeBrew', 'Category': 'Kitchen', 'Stock': '100', 'Inventory Policy': 'continue' },
          { 'Product Title': 'Yoga Mat', 'Handle': 'yoga-mat-premium', 'Status': 'active', 'Published': 'TRUE', 'SKU': 'YM003', 'Price': '0.00', 'Description': 'Premium yoga mat', 'Vendor': 'FitLife', 'Category': 'Sports', 'Stock': '25', 'Inventory Policy': 'continue' },
          { 'Product Title': 'Notebook Set', 'Handle': 'notebook-set-leather', 'Status': 'active', 'Published': 'TRUE', 'SKU': 'NB004', 'Price': '24.99', 'Description': 'Leather notebook set', 'Vendor': 'PaperCraft', 'Category': 'Stationery', 'Stock': '0', 'Inventory Policy': 'deny' },
          { 'Product Title': 'Phone Case', 'Handle': 'phone-case-clear', 'Status': 'active', 'Published': 'TRUE', 'SKU': 'PC005', 'Price': '15.00', 'Description': 'Clear protective case', 'Vendor': 'TechGuard', 'Category': 'Accessories', 'Stock': '200', 'Inventory Policy': 'continue' }
        ],
        'inventory': [
          { 'SKU': 'WH001', 'Available Qty': '45', 'Location': 'Main Warehouse', 'Unit Cost': '35.00' },
          { 'SKU': 'MUG002', 'Available Qty': '-5', 'Location': 'Store A', 'Unit Cost': '4.50' },
          { 'SKU': 'YM003', 'Available Qty': '20', 'Location': 'Main Warehouse', 'Unit Cost': '18.00' },
          { 'SKU': 'NB004', 'Available Qty': '0', 'Location': 'Store B', 'Unit Cost': '8.99' },
          { 'SKU': 'PC005', 'Available Qty': '180', 'Location': 'Distribution Center', 'Unit Cost': '5.50' }
        ],
        'customers': [
          { 'Email': 'john.smith@example.com', 'Name': 'John Smith', 'Phone': '+1-555-0123', 'Address Line 1': '123 Main St', 'Address Line 2': 'Unit 4B', 'City': 'New York', 'State': 'NY', 'Postal Code': '10001', 'Country': 'US', 'Description': 'VIP Customer' },
          { 'Email': 'sarah.doe@company.co.uk', 'Name': 'Sarah Doe', 'Phone': '+44-20-7946-0958', 'Address Line 1': '42 Baker Street', 'Address Line 2': '', 'City': 'London', 'State': 'England', 'Postal Code': 'NW1 6XE', 'Country': 'GB', 'Description': 'Corporate account' },
          { 'Email': 'mike.davis@tech.ca', 'Name': 'Mike Davis', 'Phone': '+1-416-555-0125', 'Address Line 1': '789 Pine St', 'Address Line 2': '', 'City': 'Toronto', 'State': 'ON', 'Postal Code': 'M5H 2N2', 'Country': 'CA', 'Description': '' },
          { 'Email': 'emma@startup.io', 'Name': 'Emma Chen', 'Phone': '+1-415-555-0199', 'Address Line 1': '1 Hacker Way', 'Address Line 2': '', 'City': 'Menlo Park', 'State': 'CA', 'Postal Code': '94301', 'Country': 'US', 'Description': 'Bulk orders' },
          { 'Email': 'alex.brown@example.com', 'Name': 'Alex Brown', 'Phone': '+1-555-0127', 'Address Line 1': '654 Maple Lane', 'Address Line 2': '', 'City': 'Phoenix', 'State': 'AZ', 'Postal Code': '85001', 'Country': 'US', 'Description': 'Regular customer' }
        ],
        'events': [
          { 'Title': 'Team Meeting', 'Start': '2025-01-25 09:00', 'End': '2025-01-25 10:00', 'All Day': 'FALSE', 'Location': 'Conference Room A', 'Description': 'Weekly team standup meeting', 'URL': 'https://example.com/meeting', 'Organizer': 'admin@company.com' },
          { 'Title': 'Product Launch', 'Start': '2025-01-30', 'End': '2025-01-30', 'All Day': 'TRUE', 'Location': 'San Francisco', 'Description': 'Company-wide product launch event', 'URL': 'https://example.com/launch', 'Organizer': 'events@company.com' },
          { 'Title': 'Client Presentation', 'Start': '2025-02-05 14:00', 'End': '2025-02-05 15:30', 'All Day': 'FALSE', 'Location': 'Zoom', 'Description': 'Quarterly business review with client', 'URL': 'https://zoom.us/j/123456789', 'Organizer': 'sales@company.com' },
          { 'Title': 'Company Holiday', 'Start': '2025-02-17', 'End': '2025-02-17', 'All Day': 'TRUE', 'Location': '', 'Description': 'Presidents Day - Office Closed', 'URL': '', 'Organizer': 'hr@company.com' },
          { 'Title': 'Workshop: React Training', 'Start': '2025-02-20 10:00', 'End': '2025-02-20 16:00', 'All Day': 'FALSE', 'Location': 'Training Room B', 'Description': 'Full-day React development workshop', 'URL': 'https://example.com/training', 'Organizer': 'training@company.com' }
        ]
      };

        const data = sampleData[sampleType as keyof typeof sampleData];
        if (data && data.length > 0) {
          const detectedHeaders = Object.keys(data[0] || {});

          const fakeFile = new File([''], `sample-${sampleType}.csv`, { type: 'text/csv' });
          setCsvFile(fakeFile);

          setHeaders(detectedHeaders);
          setCsvData(data);

          const autoMapping = guessMapping(detectedHeaders, template);
          setMapping(autoMapping);

          const initialTransforms: Record<string, string[]> = {};
          template.fields.forEach(field => {
            initialTransforms[field.key] = [];
          });
          setTransforms(initialTransforms);
        }
      }
    };

    if (typeof window !== 'undefined') {
      checkAndLoadSample();
    }

    const handleHashChange = () => {
      setTimeout(checkAndLoadSample, 100);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', handleHashChange);
    }

    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        checkAndLoadSample();
      }
    }, 1000);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('hashchange', handleHashChange);
      }
      clearTimeout(timeoutId);
    };
  }, [template]);

  const handleFileUpload = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }

        const data = results.data as any[];
        const detectedHeaders = Object.keys(data[0] || {});

        setHeaders(detectedHeaders);
        setCsvData(data);
        setCsvFile(file);

        const autoMapping = guessMapping(detectedHeaders, template);
        setMapping(autoMapping);

        const initialTransforms: Record<string, string[]> = {};
        template.fields.forEach(field => {
          initialTransforms[field.key] = [];
        });
        setTransforms(initialTransforms);
      }
    });
  }, [template]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    if (csvFile) {
      handleFileUpload(csvFile);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const validateMapping = useCallback(() => {
    if (csvData.length === 0) return;

    const validationResult = validateRows(csvData, template, mapping);
    setValidation(validationResult);
  }, [csvData, template, mapping]);

  useEffect(() => {
    if (Object.keys(mapping).length > 0) {
      validateMapping();
    }
  }, [mapping, validateMapping]);

  const [downloadError, setDownloadError] = useState<string | null>(null);

  const downloadMappedFile = useCallback(() => {
    if (csvData.length === 0) return;
    setDownloadError(null);

    try {
      const events: ICSEvent[] = csvData.map(row => {
        const getValue = (fieldKey: string): string => {
          const userColumn = mapping[fieldKey];
          if (!userColumn) return '';
          const value = row[userColumn];
          if (value === null || value === undefined) return '';
          return String(value).trim();
        };

        const allDayRaw = getValue('all_day');
        const allDayValue = allDayRaw ? allDayRaw.toLowerCase() : '';
        const isAllDay = ['true', '1', 'yes', 'y', 'on'].includes(allDayValue);

        return {
          title: getValue('title'),
          start: getValue('start'),
          end: getValue('end'),
          duration: getValue('duration'),
          all_day: isAllDay,
          timezone: getValue('timezone') || defaultTimezone,
          location: getValue('location'),
          description: getValue('description'),
          url: getValue('url'),
          uid: getValue('uid'),
          organizer: getValue('organizer'),
          attendees: getValue('attendees'),
        };
      });

      const ics = generateICS(events, defaultTimezone);
      const blob = new Blob([ics], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = csvFile ? csvFile.name.replace(/\.csv$/i, '') : 'calendar';
      a.download = `${baseName}.ics`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setDownloadError(`Failed to generate ICS file: ${errorMessage}. Please check your data and try again.`);
    }
  }, [csvData, mapping, csvFile, defaultTimezone]);

  const downloadMapping = useCallback(() => {
    const mappingData = {
      schema: schema,
      ...(template.templateVersion && {
        templateVersion: template.templateVersion,
        ruleVersion: template.ruleVersion,
        lastVerified: template.lastVerified,
        sourceUrls: template.sourceUrls,
      }),
      mapping: mapping,
      transforms: transforms,
      generatedAt: new Date().toISOString(),
      generatedBy: 'CalendarMap Web Interface'
    };
    const blob = new Blob([JSON.stringify(mappingData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema}-mapping.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [schema, template, mapping, transforms]);

  const downloadErrorReport = useCallback(() => {
    if (!validation || validation.sampleErrors.length === 0) return;

    const errorData = validation.sampleErrors.map(error => ({
      'Row': error.row,
      'Field': error.field,
      'Issue': error.issue,
      'Value': error.value || ''
    }));

    const csv = Papa.unparse(errorData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calendar-errors.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [validation]);

  const getCLICommand = useCallback(() => {
    return `calendarmap map --schema calendar-ics --mapping mapping.json < input.csv > output.ics`;
  }, []);

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Schema not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Page Title */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-xl text-gray-600">{template.title} Mapper</span>
          </div>
          <p className="text-gray-600 text-sm">
            Map your CSV to {template.title} format with validation
          </p>
        </div>
      </div>

      {/* Privacy Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-blue-800 text-sm text-center">
            🔒 Processing happens in your browser. Your data never leaves your device.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!csvFile ? (
          // File upload area
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-gray-600">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold mb-2">Drop your CSV file here</h3>
                <p className="mb-4">or click to browse</p>
                <div className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block font-semibold">
                  Choose File
                </div>
              </div>
            </label>
          </div>
        ) : (
          // Mapping interface
          <div className="space-y-8">
            {/* File info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">File Information</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Filename</span>
                  <p className="text-gray-900">{csvFile.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Rows</span>
                  <p className="text-gray-900">{csvData.length.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Columns</span>
                  <p className="text-gray-900">{headers.length}</p>
                </div>
              </div>
            </div>

            {/* Timezone Picker for calendar-ics */}
            {schema === 'calendar-ics' && (
              <div className="bg-white rounded-lg shadow p-6">
                <TimezonePicker
                  value={defaultTimezone}
                  onChange={setDefaultTimezone}
                  showPreview={true}
                />
              </div>
            )}

            {/* Date Format Info for calendar-ics */}
            {schema === 'calendar-ics' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Supported Date Formats</h3>
                <p className="text-sm text-gray-600 mb-4">
                  We automatically detect most common date formats. Your dates will be parsed correctly if they match any of these:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Date + Time</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li><code className="bg-gray-100 px-1 rounded">2025-01-15 09:00</code></li>
                      <li><code className="bg-gray-100 px-1 rounded">01/15/2025 9:00 AM</code></li>
                      <li><code className="bg-gray-100 px-1 rounded">15/01/2025 09:00</code></li>
                      <li><code className="bg-gray-100 px-1 rounded">January 15, 2025 9:00 AM</code></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Date Only (All-Day Events)</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li><code className="bg-gray-100 px-1 rounded">2025-01-15</code></li>
                      <li><code className="bg-gray-100 px-1 rounded">01/15/2025</code></li>
                      <li><code className="bg-gray-100 px-1 rounded">15/01/2025</code></li>
                      <li><code className="bg-gray-100 px-1 rounded">January 15, 2025</code></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Tip:</strong> For best results, use ISO format (YYYY-MM-DD) or include the month name to avoid ambiguity.
                  </p>
                </div>
              </div>
            )}

            {/* Template specification info */}
            {template.templateVersion && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">Template Specification</h3>
                    <div className="text-sm text-blue-800 mt-1 space-y-1">
                      <div>Version: {template.templateVersion} (Rules: {template.ruleVersion})</div>
                      <div>Last verified: {template.lastVerified}</div>
                      {template.sourceUrls && template.sourceUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {template.sourceUrls.map((url, idx) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline text-xs"
                            >
                              📋 Official Spec {idx + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Mapping interface */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Field Mapping</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Required fields are marked with *
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {template.fields.map(field => (
                    <div key={field.key} className="grid md:grid-cols-4 gap-4 items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </div>
                        <div className="text-sm text-gray-500">{field.key}</div>
                      </div>

                      <div>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={mapping[field.key] || ''}
                          onChange={(e) => {
                            const newMapping = { ...mapping };
                            if (e.target.value) {
                              newMapping[field.key] = e.target.value;
                            } else {
                              delete newMapping[field.key];
                            }
                            setMapping(newMapping);
                          }}
                        >
                          <option value="">Select column...</option>
                          {headers.map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        {field.transform && (
                          <div className="flex flex-wrap gap-1">
                            {field.transform.map(transform => (
                              <label key={transform} className="flex items-center text-xs">
                                <input
                                  type="checkbox"
                                  className="mr-1"
                                  checked={transforms[field.key]?.includes(transform) || false}
                                  onChange={(e) => {
                                    setTransforms(prev => ({
                                      ...prev,
                                      [field.key]: e.target.checked
                                        ? [...(prev[field.key] || []), transform]
                                        : (prev[field.key] || []).filter(t => t !== transform)
                                    }));
                                  }}
                                />
                                {transform}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        {mapping[field.key] && csvData.length > 0 && (
                          <div className="text-sm text-gray-600 truncate">
                            Preview: {csvData[0][mapping[field.key]!]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Validation results */}
            {validation && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Validation Results</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {validation.okCount.toLocaleString()}
                    </div>
                    <div className="text-gray-600">Rows OK</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {validation.errorCount.toLocaleString()}
                    </div>
                    <div className="text-gray-600">Rows with errors</div>
                  </div>
                </div>

                {validation.sampleErrors.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Error Samples:</h3>
                      <button
                        onClick={downloadErrorReport}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        📥 Download Error Report (.csv)
                      </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {validation.sampleErrors.map((error, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-mono text-gray-600">Row {error.row}, {error.field}:</span>
                          <span className="text-red-600 ml-2">{error.issue}</span>
                        </div>
                      ))}
                    </div>
                    {validation.errorCount > validation.sampleErrors.length && (
                      <div className="text-sm text-gray-500 mt-2">
                        ... and {validation.errorCount - validation.sampleErrors.length} more errors
                      </div>
                    )}
                  </div>
                )}

                {validation.businessWarnings && validation.businessWarnings.length > 0 && (
                  <div className="mt-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                        ⚠️ Business Logic Warnings
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {validation.businessWarnings.map((warning, idx) => (
                          <div key={idx} className="text-sm text-yellow-800">
                            <span className="font-mono text-yellow-700">Row {warning.row}:</span>
                            <span className="ml-2">{warning.message}</span>
                          </div>
                        ))}
                      </div>
                      {validation.businessWarnings.length === 10 && (
                        <div className="text-sm text-yellow-600 mt-2">
                          Showing first 10 warnings only
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Export buttons */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Export & Actions</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                    🔒 Files never leave your device
                  </span>
                </div>
              </div>
              {/* Download Error Message */}
              {downloadError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">Download Error</p>
                  <p className="text-red-700 text-sm mt-1">{downloadError}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadMappedFile}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                  disabled={csvData.length === 0}
                >
                  Download Calendar ICS
                </button>
                <button
                  onClick={downloadMapping}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Download Mapping JSON
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getCLICommand());
                    alert('CLI command copied to clipboard!');
                  }}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold"
                >
                  Copy CLI Command
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Context Footer */}
        <div className="mt-16 bg-gray-100 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Schema Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                {template?.title}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {schema === 'shopify-products' && (
                  <>
                    <p>• Map product catalogs with variants and pricing</p>
                    <p>• Handle inventory tracking and status updates</p>
                    <p>• Validate SKUs, prices, and product descriptions</p>
                  </>
                )}
                {schema === 'shopify-inventory' && (
                  <>
                    <p>• Update stock levels across multiple locations</p>
                    <p>• Handle inventory adjustments and tracking</p>
                    <p>• Validate quantities and location mappings</p>
                  </>
                )}
                {schema === 'stripe-customers' && (
                  <>
                    <p>• Import customer data with address validation</p>
                    <p>• Validate email formats and contact info</p>
                    <p>• Handle international address formats</p>
                  </>
                )}
                {schema === 'calendar-ics' && (
                  <>
                    <p>• Convert CSV events to ICS calendar format</p>
                    <p>• Handle both timed and all-day events</p>
                    <p>• Support timezones and recurring patterns</p>
                  </>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
              <div className="space-y-2 text-sm">
                <Link
                  href="/docs/csv-to-ics-converter"
                  className="block text-blue-600 hover:text-blue-800 hover:underline"
                >
                  📖 Complete Guide & Examples
                </Link>
                <Link
                  href="/cli"
                  className="block text-blue-600 hover:text-blue-800 hover:underline"
                >
                  ⚡ CLI Tool
                </Link>
                <Link
                  href="/self-host"
                  className="block text-blue-600 hover:text-blue-800 hover:underline"
                >
                  🔒 Self-Host Option
                </Link>
              </div>
            </div>
          </div>

          {/* Sample Data CTA */}
          <div className="mt-6 pt-4 border-t border-gray-300">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Need test data?</span> Load our sample CSV to see how mapping works.
              </div>
              <button
                onClick={() => {
                  window.location.hash = `#sample=${
                    schema === 'shopify-products' ? 'products' :
                    schema === 'shopify-inventory' ? 'inventory' :
                    schema === 'calendar-ics' ? 'events' : 'customers'
                  }`;
                  window.location.reload();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Load Sample CSV
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
