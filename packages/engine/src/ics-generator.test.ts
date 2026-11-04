import { describe, it, expect } from 'vitest';
import { generateICS } from './ics-generator';

/**
 * These tests assert on the GENERATED ICS TEXT.
 *
 * The pre-existing QA suite (ics-qa-suite.ts) only validates input event
 * objects and compares generateICS() against itself, so it could not catch
 * output bugs — every case below reproduced a real defect that shipped.
 */

const prop = (ics: string, name: string): string[] =>
  // Unfold first (RFC 5545 3.1), then pick matching properties.
  ics
    .split('\r\n')
    .reduce<string[]>((acc, line) => {
      if (line.startsWith(' ') && acc.length) acc[acc.length - 1] += line.slice(1);
      else acc.push(line);
      return acc;
    }, [])
    .filter((l) => l.startsWith(name));

/** Run fn with a given TZ, restoring the previous value afterwards. */
const withTZ = <T,>(tz: string, fn: () => T): T => {
  const prev = process.env.TZ;
  process.env.TZ = tz;
  try {
    return fn();
  } finally {
    process.env.TZ = prev;
  }
};

const ZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Tokyo',
  'Pacific/Kiritimati',
];

describe('output is independent of the machine timezone', () => {
  it('keeps an all-day date on the day the CSV named', () => {
    for (const tz of ZONES) {
      const ics = withTZ(tz, () =>
        generateICS([{ title: 'Christmas', start: '2025-12-25', all_day: true }])
      );
      expect(prop(ics, 'DTSTART'), tz).toEqual(['DTSTART;VALUE=DATE:20251225']);
    }
  });

  it('keeps a timed event at the wall-clock time the CSV named', () => {
    for (const tz of ZONES) {
      const ics = withTZ(tz, () =>
        generateICS([
          {
            title: 'Standup',
            start: '2025-03-15T09:00:00',
            end: '2025-03-15T09:30:00',
            timezone: 'America/Chicago',
          },
        ])
      );
      expect(prop(ics, 'DTSTART'), tz).toEqual([
        'DTSTART;TZID=America/Chicago:20250315T090000',
      ]);
    }
  });
});

describe('all-day DTEND is exclusive (RFC 5545 3.6.1)', () => {
  it('gives a single-day event a one-day span', () => {
    const ics = generateICS([
      { title: 'X', start: '2025-12-25', end: '2025-12-25', all_day: true },
    ]);
    expect(prop(ics, 'DTEND')).toEqual(['DTEND;VALUE=DATE:20251226']);
  });

  it('covers the final day of a multi-day span', () => {
    const ics = generateICS([
      { title: 'Conf', start: '2025-06-15', end: '2025-06-17', all_day: true },
    ]);
    // Jun 15-17 inclusive is three days, so DTEND is the 18th.
    expect(prop(ics, 'DTEND')).toEqual(['DTEND;VALUE=DATE:20250618']);
  });

  it('rolls over a month boundary', () => {
    const ics = generateICS([
      { title: 'X', start: '2025-01-31', end: '2025-01-31', all_day: true },
    ]);
    expect(prop(ics, 'DTEND')).toEqual(['DTEND;VALUE=DATE:20250201']);
  });

  it('handles a leap day', () => {
    const ics = generateICS([
      { title: 'X', start: '2024-02-29', end: '2024-02-29', all_day: true },
    ]);
    expect(prop(ics, 'DTEND')).toEqual(['DTEND;VALUE=DATE:20240301']);
  });
});

describe('UTC uses the Z suffix, not TZID=UTC', () => {
  it('emits a Z-suffixed stamp when no timezone is given', () => {
    const ics = generateICS([
      { title: 'X', start: '2025-03-15T09:00:00', end: '2025-03-15T10:00:00' },
    ]);
    expect(prop(ics, 'DTSTART')).toEqual(['DTSTART:20250315T090000Z']);
    expect(ics).not.toContain('TZID=UTC');
  });
});

describe('line folding counts octets and preserves characters', () => {
  it('keeps every line within 75 octets', () => {
    const ics = generateICS([
      { title: '🎉'.repeat(40), start: '2025-06-15T10:00:00' },
    ]);
    for (const line of ics.split('\r\n')) {
      expect(Buffer.byteLength(line, 'utf8')).toBeLessThanOrEqual(75);
    }
  });

  it('never splits a multi-byte character', () => {
    const title = '🎉'.repeat(40);
    const ics = generateICS([{ title, start: '2025-06-15T10:00:00' }]);
    expect(ics).not.toContain('�');
    expect(prop(ics, 'SUMMARY')).toEqual([`SUMMARY:${title}`]);
  });

  it('round-trips long accented text', () => {
    const title = 'é'.repeat(100);
    const ics = generateICS([{ title, start: '2025-06-15T10:00:00' }]);
    expect(prop(ics, 'SUMMARY')).toEqual([`SUMMARY:${title}`]);
  });
});

describe('unreadable dates never produce a corrupt VEVENT', () => {
  it('skips a row with an empty start instead of emitting an empty property', () => {
    const ics = generateICS([
      { title: 'Bad', start: '' },
      { title: 'Good', start: '2025-06-15T10:00:00' },
    ]);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(prop(ics, 'SUMMARY')).toEqual(['SUMMARY:Good']);
    // No property may be emitted with an empty value.
    expect(ics).not.toMatch(/DTSTART[^:\r\n]*:\r\n/);
  });

  it('skips an unparseable start', () => {
    const ics = generateICS([{ title: 'Bad', start: 'not-a-date' }]);
    expect(ics.match(/BEGIN:VEVENT/g)).toBeNull();
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
  });
});

describe('attendees', () => {
  it('splits on commas as well as semicolons', () => {
    const ics = generateICS([
      { title: 'X', start: '2025-06-15T10:00:00', attendees: 'a@x.com, b@y.com' },
    ]);
    expect(prop(ics, 'ATTENDEE')).toEqual([
      'ATTENDEE:mailto:a@x.com',
      'ATTENDEE:mailto:b@y.com',
    ]);
  });
});

describe('structure and escaping', () => {
  it('terminates every line with CRLF and none bare', () => {
    const ics = generateICS([{ title: 'X', start: '2025-06-15T10:00:00' }]);
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
  });

  it('escapes special characters in text properties', () => {
    const ics = generateICS([
      {
        title: 'A, B; C\\ D',
        start: '2025-06-15T10:00:00',
        description: 'line1\nline2',
      },
    ]);
    expect(prop(ics, 'SUMMARY')).toEqual(['SUMMARY:A\\, B\\; C\\\\ D']);
    expect(prop(ics, 'DESCRIPTION')).toEqual(['DESCRIPTION:line1\\nline2']);
  });

  it('cannot be made to inject a property via a description', () => {
    const ics = generateICS([
      {
        title: 'X',
        start: '2025-06-15T10:00:00',
        description: 'x\r\nSUMMARY:HACKED',
      },
    ]);
    expect(prop(ics, 'SUMMARY')).toEqual(['SUMMARY:X']);
  });

  it('emits the required calendar and event properties', () => {
    const ics = generateICS([{ title: 'X', start: '2025-06-15T10:00:00' }]);
    for (const required of [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:',
      'BEGIN:VEVENT',
      'UID:',
      'DTSTAMP:',
      'END:VEVENT',
      'END:VCALENDAR',
    ]) {
      expect(ics).toContain(required);
    }
  });

  it('generates a unique UID per event even for identical rows', () => {
    const events = Array.from({ length: 50 }, () => ({
      title: 'Same',
      start: '2025-06-15T10:00:00',
    }));
    const uids = prop(generateICS(events), 'UID:');
    expect(new Set(uids).size).toBe(50);
  });

  it('emits a valid empty calendar for no events', () => {
    const ics = generateICS([]);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).not.toContain('BEGIN:VEVENT');
  });
});
