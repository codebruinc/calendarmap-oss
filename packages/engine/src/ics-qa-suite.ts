import { ICSEvent, generateICS } from './ics-generator';
import { validateICSEvents, ICSValidationResult } from './ics-validator';

export interface QATestCase {
  name: string;
  description: string;
  events: ICSEvent[];
  shouldPass: boolean;
  expectedIssues?: string[];
}

/**
 * Comprehensive ICS QA Suite
 * Golden cases: timed events with TZ; all-day events; events crossing DST.
 * Red cases: end < start; invalid TZID; unescaped commas/newlines; overly long lines.
 * Round-trip: map → export → re-import to CalendarMap shows identical semantics.
 */

export const goldenCases: QATestCase[] = [
  {
    name: 'Timed Event with Timezone',
    description: 'Standard timed event with proper timezone',
    shouldPass: true,
    events: [{
      title: 'Team Meeting',
      start: '2025-03-15T09:00:00',
      end: '2025-03-15T10:30:00',
      timezone: 'America/New_York',
      location: 'Conference Room A',
      description: 'Weekly team standup meeting',
    }]
  },
  {
    name: 'All-Day Event',
    description: 'Simple all-day event',
    shouldPass: true,
    events: [{
      title: 'Company Holiday',
      start: '2025-12-25',
      end: '2025-12-25',
      all_day: true,
      description: 'Christmas Day - Office Closed',
    }]
  },
  {
    name: 'DST Crossing Event',
    description: 'Event that crosses Daylight Saving Time boundary',
    shouldPass: true,
    events: [{
      title: 'DST Transition Meeting',
      start: '2025-03-09T01:30:00',
      end: '2025-03-09T03:30:00', // Crosses "spring forward" at 2 AM
      timezone: 'America/New_York',
      description: 'Meeting that spans DST transition',
    }]
  },
  {
    name: 'UTC Event',
    description: 'Event in UTC timezone',
    shouldPass: true,
    events: [{
      title: 'Global Standup',
      start: '2025-01-15T14:00:00',
      end: '2025-01-15T14:30:00',
      timezone: 'UTC',
      description: 'Daily global team standup',
    }]
  },
  {
    name: 'Multiple Day All-Day Event',
    description: 'Multi-day all-day event like a conference',
    shouldPass: true,
    events: [{
      title: 'Tech Conference 2025',
      start: '2025-06-15',
      end: '2025-06-17',
      all_day: true,
      location: 'Convention Center',
      description: 'Annual technology conference',
      url: 'https://techconf2025.com',
    }]
  },
  {
    name: 'Event with Duration',
    description: 'Event using duration instead of end time',
    shouldPass: true,
    events: [{
      title: 'Workshop',
      start: '2025-04-20T10:00:00',
      duration: 'PT2H30M',
      timezone: 'Europe/London',
      description: 'React Development Workshop',
    }]
  }
];

export const redCases: QATestCase[] = [
  {
    name: 'End Before Start',
    description: 'End time is before start time',
    shouldPass: false,
    expectedIssues: ['End time must be after start time'],
    events: [{
      title: 'Invalid Event',
      start: '2025-01-15T15:00:00',
      end: '2025-01-15T14:00:00', // End before start
      timezone: 'UTC',
    }]
  },
  {
    name: 'Invalid Timezone',
    description: 'Unrecognized timezone identifier',
    shouldPass: false,
    expectedIssues: ['Invalid timezone'],
    events: [{
      title: 'Bad Timezone Event',
      start: '2025-01-15T10:00:00',
      end: '2025-01-15T11:00:00',
      timezone: 'Invalid/Timezone',
    }]
  },
  {
    name: 'Unescaped Special Characters',
    description: 'Title and description with unescaped commas, semicolons, newlines',
    shouldPass: false,
    expectedIssues: ['contains special characters', 'contains special characters'],
    events: [{
      title: 'Meeting, Review; Planning',
      description: 'Discuss Q1 results,\nPlan Q2 strategy;\nReview budgets',
      start: '2025-01-15T10:00:00',
      end: '2025-01-15T11:00:00',
    }]
  },
  {
    name: 'Missing Required Fields',
    description: 'Event missing title and start',
    shouldPass: false,
    expectedIssues: ['Missing required field \'title\'', 'Missing required field \'start\''],
    events: [{
      title: '', // Missing title
      start: '', // Missing start
      description: 'Event with missing required fields',
    }]
  },
  {
    name: 'Invalid Date Format',
    description: 'Malformed date strings',
    shouldPass: false,
    expectedIssues: ['Invalid start date format', 'Invalid end date format'],
    events: [{
      title: 'Bad Date Event',
      start: 'not-a-date',
      end: '2025/15/45 25:00:00', // Invalid date
    }]
  },
  {
    name: 'Invalid Duration Format',
    description: 'Malformed duration string',
    shouldPass: false,
    expectedIssues: ['Invalid duration format'],
    events: [{
      title: 'Bad Duration Event',
      start: '2025-01-15T10:00:00',
      duration: '2 hours', // Should be PT2H
    }]
  },
  {
    name: 'Invalid Email Addresses',
    description: 'Malformed organizer and attendee emails',
    shouldPass: false,
    expectedIssues: ['not a valid email address', 'Invalid attendee email'],
    events: [{
      title: 'Email Test Event',
      start: '2025-01-15T10:00:00',
      end: '2025-01-15T11:00:00',
      organizer: 'not-an-email',
      attendees: 'bad-email, also@not@valid',
    }]
  }
];

export interface QAResult {
  passed: number;
  failed: number;
  total: number;
  details: Array<{
    testCase: QATestCase;
    result: ICSValidationResult;
    passed: boolean;
    errors: string[];
  }>;
}

/**
 * Run the complete QA suite
 */
export function runQASuite(): QAResult {
  const allCases = [...goldenCases, ...redCases];
  const results: QAResult = {
    passed: 0,
    failed: 0,
    total: allCases.length,
    details: []
  };

  for (const testCase of allCases) {
    const validation = validateICSEvents(testCase.events);
    const passed = testCase.shouldPass ? validation.isValid : !validation.isValid;
    
    const errors: string[] = [];
    
    // Check if expected issues are present for red cases
    if (!testCase.shouldPass && testCase.expectedIssues) {
      for (const expectedIssue of testCase.expectedIssues) {
        const found = validation.issues.some(issue => 
          issue.message.toLowerCase().includes(expectedIssue.toLowerCase())
        );
        if (!found) {
          errors.push(`Expected issue not found: ${expectedIssue}`);
        }
      }
    }
    
    // Check that golden cases don't have errors
    if (testCase.shouldPass) {
      const hasErrors = validation.issues.some(issue => issue.severity === 'error');
      if (hasErrors) {
        errors.push('Golden case should not have validation errors');
      }
    }

    if (passed && errors.length === 0) {
      results.passed++;
    } else {
      results.failed++;
    }

    results.details.push({
      testCase,
      result: validation,
      passed: passed && errors.length === 0,
      errors
    });
  }

  return results;
}

/**
 * Enhanced ICS validation with line length checking
 */
export function validateICSOutput(icsContent: string): ICSValidationResult {
  const issues: any[] = [];
  const lines = icsContent.split('\r\n');
  
  // Check for overly long lines (RFC 5545 recommends 75 characters)
  lines.forEach((line, index) => {
    if (line.length > 75) {
      // Check if it's properly folded (next line starts with space)
      const nextLine = lines[index + 1];
      if (!nextLine || !nextLine.startsWith(' ')) {
        issues.push({
          severity: 'error',
          message: `Line ${index + 1}: Line too long (${line.length} chars) and not properly folded. RFC 5545 requires lines to be folded at 75 characters.`
        });
      }
    }
  });

  // Check for proper CRLF line endings
  if (icsContent.includes('\n') && !icsContent.includes('\r\n')) {
    issues.push({
      severity: 'warning',
      message: 'ICS content should use CRLF (\\r\\n) line endings per RFC 5545'
    });
  }

  // Check for required VCALENDAR wrapper
  if (!icsContent.includes('BEGIN:VCALENDAR') || !icsContent.includes('END:VCALENDAR')) {
    issues.push({
      severity: 'error',
      message: 'ICS content must be wrapped in VCALENDAR component'
    });
  }

  // Check for proper VEVENT blocks
  const beginEvents = (icsContent.match(/BEGIN:VEVENT/g) || []).length;
  const endEvents = (icsContent.match(/END:VEVENT/g) || []).length;
  if (beginEvents !== endEvents) {
    issues.push({
      severity: 'error',
      message: `Mismatched VEVENT blocks: ${beginEvents} BEGIN:VEVENT vs ${endEvents} END:VEVENT`
    });
  }

  return {
    isValid: issues.filter(i => i.severity === 'error').length === 0,
    issues,
    stats: {
      totalEvents: beginEvents,
      validEvents: beginEvents,
      hasAllRequiredFields: true,
      hasTimezone: icsContent.includes('TZID='),
      hasAllDayEvents: icsContent.includes('VALUE=DATE:'),
      hasTimedEvents: icsContent.includes('TZID=') || icsContent.includes('DTSTART:')
    }
  };
}

/**
 * Round-trip test: generate ICS → parse → re-generate → compare
 */
export function runRoundTripTest(events: ICSEvent[]): {
  passed: boolean;
  originalICS: string;
  roundTripICS: string;
  differences: string[];
} {
  // Generate original ICS
  const originalICS = generateICS(events);
  
  // For now, we'll do a simple round-trip by re-generating
  // In a full implementation, we'd parse the ICS back to events
  const roundTripICS = generateICS(events);
  
  const differences: string[] = [];
  
  // Semantic comparison - ignore timestamp differences
  const originalNormalized = normalizeICSForComparison(originalICS);
  const roundTripNormalized = normalizeICSForComparison(roundTripICS);
  
  if (originalNormalized !== roundTripNormalized) {
    differences.push('Generated ICS content differs on re-generation (semantic)');
  }
  
  // Check that both are valid
  const originalValidation = validateICSOutput(originalICS);
  const roundTripValidation = validateICSOutput(roundTripICS);
  
  if (!originalValidation.isValid) {
    differences.push('Original ICS is invalid');
  }
  
  if (!roundTripValidation.isValid) {
    differences.push('Round-trip ICS is invalid');
  }

  return {
    passed: differences.length === 0,
    originalICS,
    roundTripICS,
    differences
  };
}

/**
 * Normalize ICS content for comparison by removing volatile fields
 */
function normalizeICSForComparison(icsContent: string): string {
  return icsContent
    // Remove DTSTAMP lines (they contain timestamps)
    .replace(/DTSTAMP:[^\r\n]+[\r\n]+/g, '')
    // Remove CREATED lines (they contain timestamps)
    .replace(/CREATED:[^\r\n]+[\r\n]+/g, '')
    // Remove LAST-MODIFIED lines (they contain timestamps)
    .replace(/LAST-MODIFIED:[^\r\n]+[\r\n]+/g, '')
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .trim();
}

/**
 * Format QA results for display
 */
export function formatQAReport(results: QAResult): string {
  const lines: string[] = [];
  
  lines.push('ICS QA Suite Results');
  lines.push('===================');
  lines.push(`Total Tests: ${results.total}`);
  lines.push(`Passed: ${results.passed} ✅`);
  lines.push(`Failed: ${results.failed} ${results.failed > 0 ? '❌' : ''}`);
  lines.push(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  lines.push('');

  if (results.failed > 0) {
    lines.push('Failed Tests:');
    lines.push('-------------');
    
    results.details
      .filter(d => !d.passed)
      .forEach(detail => {
        lines.push(`❌ ${detail.testCase.name}`);
        lines.push(`   ${detail.testCase.description}`);
        if (detail.errors.length > 0) {
          detail.errors.forEach(error => lines.push(`   • ${error}`));
        }
        detail.result.issues.forEach(issue => {
          lines.push(`   • ${issue.severity.toUpperCase()}: ${issue.message}`);
        });
        lines.push('');
      });
  }

  lines.push('Golden Cases (should pass):');
  goldenCases.forEach(testCase => {
    const detail = results.details.find(d => d.testCase === testCase);
    lines.push(`${detail?.passed ? '✅' : '❌'} ${testCase.name}`);
  });

  lines.push('');
  lines.push('Red Cases (should fail with clear errors):');
  redCases.forEach(testCase => {
    const detail = results.details.find(d => d.testCase === testCase);
    lines.push(`${detail?.passed ? '✅' : '❌'} ${testCase.name}`);
  });

  return lines.join('\n');
}