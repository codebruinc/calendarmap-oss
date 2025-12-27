'use client';

import { Clock, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

interface TimezonePickerProps {
  value: string;
  onChange: (timezone: string) => void;
  showPreview?: boolean;
}

// Common timezones grouped by region
const TIMEZONE_GROUPS = {
  'Common': [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
  ],
  'Americas': [
    { value: 'America/Anchorage', label: 'Alaska' },
    { value: 'America/Phoenix', label: 'Arizona' },
    { value: 'America/Toronto', label: 'Toronto' },
    { value: 'America/Vancouver', label: 'Vancouver' },
    { value: 'America/Mexico_City', label: 'Mexico City' },
    { value: 'America/Sao_Paulo', label: 'São Paulo' },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires' },
  ],
  'Europe': [
    { value: 'Europe/Dublin', label: 'Dublin' },
    { value: 'Europe/Berlin', label: 'Berlin' },
    { value: 'Europe/Amsterdam', label: 'Amsterdam' },
    { value: 'Europe/Rome', label: 'Rome' },
    { value: 'Europe/Madrid', label: 'Madrid' },
    { value: 'Europe/Warsaw', label: 'Warsaw' },
    { value: 'Europe/Stockholm', label: 'Stockholm' },
    { value: 'Europe/Athens', label: 'Athens' },
    { value: 'Europe/Moscow', label: 'Moscow' },
    { value: 'Europe/Istanbul', label: 'Istanbul' },
  ],
  'Asia': [
    { value: 'Asia/Dubai', label: 'Dubai' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Bangkok', label: 'Bangkok' },
    { value: 'Asia/Singapore', label: 'Singapore' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong' },
    { value: 'Asia/Seoul', label: 'Seoul' },
    { value: 'Asia/Taipei', label: 'Taipei' },
  ],
  'Pacific/Oceania': [
    { value: 'Pacific/Auckland', label: 'Auckland' },
    { value: 'Australia/Perth', label: 'Perth' },
    { value: 'Australia/Brisbane', label: 'Brisbane' },
    { value: 'Australia/Melbourne', label: 'Melbourne' },
    { value: 'Pacific/Honolulu', label: 'Hawaii' },
    { value: 'Pacific/Fiji', label: 'Fiji' },
  ],
  'Africa': [
    { value: 'Africa/Cairo', label: 'Cairo' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg' },
    { value: 'Africa/Lagos', label: 'Lagos' },
    { value: 'Africa/Nairobi', label: 'Nairobi' },
  ],
};

export default function TimezonePicker({ value, onChange, showPreview = true }: TimezonePickerProps) {
  const [browserTimezone, setBrowserTimezone] = useState<string>('UTC');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Get browser timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setBrowserTimezone(tz);
    
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getTimezonePreview = (tz: string) => {
    try {
      const timeStr = formatInTimeZone(currentTime, tz, 'EEE, HH:mm');
      const dateStr = formatInTimeZone(currentTime, tz, 'MMM d');
      const offset = formatInTimeZone(currentTime, tz, 'zzz');
      return `${timeStr} — ${dateStr} (${offset})`;
    } catch {
      return 'Invalid timezone';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Globe className="w-4 h-4 inline mr-1" />
            Default Timezone
          </label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Use browser timezone ({browserTimezone})</option>
            {Object.entries(TIMEZONE_GROUPS).map(([group, zones]) => (
              <optgroup key={group} label={group}>
                {zones.map(zone => (
                  <option key={zone.value} value={zone.value}>
                    {zone.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        
        {showPreview && (
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Current Time
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
              {getTimezonePreview(value || browserTimezone)}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500">
        <p>💡 Individual events can override this with a "Timezone" column in your CSV</p>
      </div>
    </div>
  );
}