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
    // A date we cannot read must not become an empty property value: an
    // emitted "DTSTART;TZID=UTC:" is a structurally corrupt VEVENT that
    // validateICSOutput still reported as valid, so the user downloaded a
    // broken calendar with no warning. Skipping the row is the honest
    // outcome, and validateICSEvents already reports it to the UI.
    if (!formatDateOnly(event.start)) {
      return;
    }

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

      // DTEND for an all-day event is EXCLUSIVE (RFC 5545 3.6.1): it names the
      // first day NOT covered. A CSV saying "Dec 25 to Dec 25" means one full
      // day, so DTEND must be Dec 26 — passing the end date through verbatim
      // produced a zero-length event that clients hide or collapse.
      const lastDay = event.end ? formatDateOnly(event.end) : startDate;
      lines.push(`DTEND;VALUE=DATE:${addDaysToDateOnly(lastDay, 1)}`);
    } else {
      // RFC 5545 defines UTC as the "Z" suffix form; there is no VTIMEZONE
      // named "UTC", so TZID=UTC is not valid for strict parsers.
      const stamp = (value: string) =>
        tz === 'UTC' ? `:${value}Z` : `;TZID=${tz}:${value}`;

      const startDateTime = formatDateTime(event.start, tz);
      lines.push(`DTSTART${stamp(startDateTime)}`);

      if (event.end) {
        const endDateTime = formatDateTime(event.end, tz);
        lines.push(`DTEND${stamp(endDateTime)}`);
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
      lines.push(`URL:${escapeText(event.url)}`);
    }
    
    if (event.organizer) {
      lines.push(`ORGANIZER:mailto:${event.organizer}`);
    }
    
    if (event.attendees) {
      // Accept both separators: the validator splits on /[;,]/, so a
      // comma-separated list passed validation and then emitted a single
      // malformed ATTENDEE containing every address.
      const emails = event.attendees.split(/[;,]/).map(email => email.trim());
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

/**
 * Pull the calendar fields out of a date string without going through an
 * absolute instant.
 *
 * A CSV value like "2025-12-25" or "2025-03-15 09:00" is wall-clock: it means
 * that date, that clock time, in whatever timezone the event declares. Parsing
 * it into a Date makes it an instant (bare ISO dates parse as UTC midnight),
 * and rendering that instant back out applies the *machine's* offset — so the
 * same CSV produced a different calendar day or hour depending on which
 * browser ran the conversion. Read the digits instead.
 */
function extractWallClock(dateStr: string): {
  year: number; month: number; day: number;
  hour: number; minute: number; second: number;
} | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // ISO-ish: 2025-12-25, 2025-12-25T09:00, 2025-12-25 09:00:00, trailing Z/offset
  const iso = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (iso) {
    return {
      year: +iso[1], month: +iso[2], day: +iso[3],
      hour: +(iso[4] ?? 0), minute: +(iso[5] ?? 0), second: +(iso[6] ?? 0),
    };
  }

  // Everything else (slash dates, "Dec 25 2025", etc.) goes through the
  // existing tolerant parser. Those formats are parsed by date-fns in local
  // time, so reading the local getters back out is lossless here.
  const parsed = parseFlexibleDate(trimmed, true);
  if (!parsed) return null;
  return {
    year: parsed.getFullYear(), month: parsed.getMonth() + 1, day: parsed.getDate(),
    hour: parsed.getHours(), minute: parsed.getMinutes(), second: parsed.getSeconds(),
  };
}

const pad = (n: number, width = 2) => String(n).padStart(width, '0');

function formatDateOnly(dateStr: string): string {
  const wc = extractWallClock(dateStr);
  if (!wc) return '';
  return `${pad(wc.year, 4)}${pad(wc.month)}${pad(wc.day)}`;
}

function formatDateTime(dateStr: string, _timezone: string): string {
  const wc = extractWallClock(dateStr);
  if (!wc) return '';
  // Emit the wall-clock digits as given. The zone is carried by TZID= (or the
  // Z suffix for UTC) at the call site, so converting here would double-apply
  // the offset.
  return `${pad(wc.year, 4)}${pad(wc.month)}${pad(wc.day)}T` +
    `${pad(wc.hour)}${pad(wc.minute)}${pad(wc.second)}`;
}

/** Shift a yyyymmdd string by whole days, for exclusive all-day DTEND. */
function addDaysToDateOnly(yyyymmdd: string, days: number): string {
  if (!/^\d{8}$/.test(yyyymmdd)) return yyyymmdd;
  const y = +yyyymmdd.slice(0, 4), m = +yyyymmdd.slice(4, 6), d = +yyyymmdd.slice(6, 8);
  // UTC arithmetic only — no local-offset rollover.
  const t = new Date(Date.UTC(y, m - 1, d));
  t.setUTCDate(t.getUTCDate() + days);
  return `${pad(t.getUTCFullYear(), 4)}${pad(t.getUTCMonth() + 1)}${pad(t.getUTCDate())}`;
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * Fold a content line to 75 OCTETS (RFC 5545 3.1), not 75 characters.
 *
 * The limit is defined in octets, so counting UTF-16 units let a line of
 * non-ASCII text run far over it (40 emoji produced a 143-octet SUMMARY).
 * Folding is also only legal between characters, never inside a multi-byte
 * sequence, so we accumulate whole code points by their encoded width.
 */
function foldLine(line: string): string {
  if (Buffer.byteLength(line, 'utf8') <= 75) return line;

  const folded: string[] = [];
  // First line carries 75 octets; continuations spend one on the leading space.
  let limit = 75;
  let current = '';
  let currentBytes = 0;

  // Iterating the string yields whole code points, so surrogate pairs stay intact.
  for (const char of line) {
    const charBytes = Buffer.byteLength(char, 'utf8');
    if (currentBytes + charBytes > limit) {
      folded.push(folded.length === 0 ? current : ' ' + current);
      current = '';
      currentBytes = 0;
      limit = 74;
    }
    current += char;
    currentBytes += charBytes;
  }

  if (current) {
    folded.push(folded.length === 0 ? current : ' ' + current);
  }

  return folded.join('\r\n');
}