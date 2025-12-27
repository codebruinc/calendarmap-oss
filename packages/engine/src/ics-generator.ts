import { format, parse, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Common date formats users might have in their CSVs
const DATE_TIME_FORMATS = [
  // ISO formats
  "yyyy-MM-dd'T'HH:mm:ss",
  "yyyy-MM-dd'T'HH:mm",
  "yyyy-MM-dd HH:mm:ss",
  "yyyy-MM-dd HH:mm",
  // US formats
  'MM/dd/yyyy HH:mm:ss',
  'MM/dd/yyyy HH:mm',
  'MM/dd/yyyy h:mm a',
  'MM/dd/yyyy h:mm:ss a',
  'M/d/yyyy HH:mm',
  'M/d/yyyy h:mm a',
  // European formats
  'dd/MM/yyyy HH:mm:ss',
  'dd/MM/yyyy HH:mm',
  'dd-MM-yyyy HH:mm:ss',
  'dd-MM-yyyy HH:mm',
  'dd.MM.yyyy HH:mm:ss',
  'dd.MM.yyyy HH:mm',
  // Other common formats
  'yyyy/MM/dd HH:mm:ss',
  'yyyy/MM/dd HH:mm',
  'MMMM d, yyyy h:mm a',
  'MMMM d, yyyy HH:mm',
  'MMM d, yyyy h:mm a',
  'MMM d, yyyy HH:mm',
];

const DATE_ONLY_FORMATS = [
  'yyyy-MM-dd',
  'MM/dd/yyyy',
  'M/d/yyyy',
  'dd/MM/yyyy',
  'dd-MM-yyyy',
  'dd.MM.yyyy',
  'yyyy/MM/dd',
  'MMMM d, yyyy',
  'MMM d, yyyy',
];

/**
 * Try to parse a date string using multiple common formats
 * Exported for use in validation
 */
export function parseFlexibleDate(dateStr: string, includeTime: boolean = true): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // First, try native Date parsing (handles ISO 8601 well)
  // Normalize space to T for ISO-like formats
  const normalized = trimmed.replace(' ', 'T');
  const nativeDate = new Date(normalized);
  if (isValid(nativeDate) && !isNaN(nativeDate.getTime())) {
    return nativeDate;
  }

  // Try each format
  const formats = includeTime ? DATE_TIME_FORMATS : DATE_ONLY_FORMATS;
  for (const fmt of formats) {
    try {
      const parsed = parse(trimmed, fmt, new Date());
      if (isValid(parsed) && !isNaN(parsed.getTime())) {
        // Sanity check: year should be reasonable (1900-2100)
        const year = parsed.getFullYear();
        if (year >= 1900 && year <= 2100) {
          return parsed;
        }
      }
    } catch {
      // Continue to next format
    }
  }

  // If includeTime formats failed, try date-only formats and assume midnight
  if (includeTime) {
    const dateOnly = parseFlexibleDate(trimmed, false);
    if (dateOnly) {
      return dateOnly;
    }
  }

  return null;
}

export interface ICSEvent {
  title: string;
  start: string;
  end?: string;
  duration?: string;
  all_day?: boolean;
  timezone?: string;
  location?: string;
  description?: string;
  url?: string;
  uid?: string;
  organizer?: string;
  attendees?: string;
}

export function generateICS(events: ICSEvent[], defaultTimezone = 'UTC'): string {
  const lines: string[] = [];
  
  // ICS Header
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//CalendarMap//CalendarMap v1//EN');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');
  
  // Process each event
  events.forEach((event, index) => {
    lines.push('BEGIN:VEVENT');
    
    // UID (required)
    const uid = event.uid || generateUID(event.title, event.start, index);
    lines.push(`UID:${uid}`);
    
    // DTSTAMP (required) - when this VEVENT was created
    const now = formatDateTime(new Date().toISOString(), 'UTC');
    lines.push(`DTSTAMP:${now}Z`);
    
    // Title (required)
    lines.push(`SUMMARY:${escapeText(event.title)}`);
    
    // Dates (required)
    const tz = event.timezone || defaultTimezone;
    const isAllDay = event.all_day === true;
    
    if (isAllDay) {
      const startDate = formatDateOnly(event.start);
      lines.push(`DTSTART;VALUE=DATE:${startDate}`);
      
      if (event.end) {
        const endDate = formatDateOnly(event.end);
        lines.push(`DTEND;VALUE=DATE:${endDate}`);
      } else {
        // For all-day events, DTEND should be the next day
        const nextDay = new Date(event.start);
        nextDay.setDate(nextDay.getDate() + 1);
        const endDate = formatDateOnly(nextDay.toISOString());
        lines.push(`DTEND;VALUE=DATE:${endDate}`);
      }
    } else {
      const startDateTime = formatDateTime(event.start, tz);
      lines.push(`DTSTART;TZID=${tz}:${startDateTime}`);
      
      if (event.end) {
        const endDateTime = formatDateTime(event.end, tz);
        lines.push(`DTEND;TZID=${tz}:${endDateTime}`);
      } else if (event.duration) {
        lines.push(`DURATION:${event.duration}`);
      } else {
        // Default to 1 hour duration if no end time specified
        lines.push(`DURATION:PT1H`);
      }
    }
    
    // Optional fields
    if (event.location) {
      lines.push(`LOCATION:${escapeText(event.location)}`);
    }
    
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeText(event.description)}`);
    }
    
    if (event.url) {
      lines.push(`URL:${event.url}`);
    }
    
    if (event.organizer) {
      lines.push(`ORGANIZER:mailto:${event.organizer}`);
    }
    
    if (event.attendees) {
      const emails = event.attendees.split(';').map(email => email.trim());
      emails.forEach(email => {
        if (email) {
          lines.push(`ATTENDEE:mailto:${email}`);
        }
      });
    }
    
    // Created/Modified timestamps (reuse the now variable from DTSTAMP)
    lines.push(`CREATED:${now}Z`);
    lines.push(`LAST-MODIFIED:${now}Z`);
    
    lines.push('END:VEVENT');
  });
  
  lines.push('END:VCALENDAR');
  
  // Fold long lines to 75 characters
  return lines.map(foldLine).join('\r\n');
}

function generateUID(title: string, start: string, index: number): string {
  const hash = simpleHash(title + start + index);
  return `${hash}@calendarmap.app`;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

function formatDateOnly(dateStr: string): string {
  try {
    const date = parseFlexibleDate(dateStr, false);
    if (!date) return '';
    return format(date, 'yyyyMMdd');
  } catch {
    return '';
  }
}

function formatDateTime(dateStr: string, timezone: string): string {
  try {
    const date = parseFlexibleDate(dateStr, true);
    if (!date) return '';

    // Note: 'T' must be escaped with single quotes in date-fns format strings
    if (timezone === 'UTC') {
      return format(date, "yyyyMMdd'T'HHmmss");
    } else {
      return formatInTimeZone(date, timezone, "yyyyMMdd'T'HHmmss");
    }
  } catch {
    return '';
  }
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  
  const folded: string[] = [];
  let pos = 0;
  
  while (pos < line.length) {
    if (pos === 0) {
      folded.push(line.substring(0, Math.min(75, line.length)));
      pos = 75;
    } else {
      folded.push(' ' + line.substring(pos, Math.min(pos + 74, line.length)));
      pos += 74;
    }
  }
  
  return folded.join('\r\n');
}