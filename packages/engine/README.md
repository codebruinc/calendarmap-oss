# @calendarmap/engine

Core CSV to ICS mapping engine for CalendarMap with smart field detection and validation.

## Installation

```bash
npm install @calendarmap/engine
```

## Usage

```typescript
import { templates, guessMapping, applyMapping, validateRows } from '@calendarmap/engine';

// Get the calendar template
const template = templates['calendar-ics'];

// Guess field mappings from CSV headers
const headers = ['Event Name', 'Start Date', 'End Date', 'Location'];
const mapping = guessMapping(headers, template);

// Apply mapping to convert CSV rows
const csvData = [
  { 'Event Name': 'Team Meeting', 'Start Date': '2024-01-15 10:00', /* ... */ }
];
const result = applyMapping(csvData, template, mapping);

// Validate the results
const validation = validateRows(csvData, template, mapping);
console.log(`${validation.validCount}/${validation.totalCount} rows valid`);
```

## Features

- 🤖 **Smart Field Detection** - Automatically maps CSV columns to calendar fields
- ✅ **Data Validation** - Validates dates, times, and required fields
- 🌍 **Timezone Support** - Handles timezones and date formats
- 📅 **RFC 5545 Compliant** - Generates standards-compliant ICS data
- 🔧 **Extensible** - Template system for different output formats

## API Reference

### Templates

```typescript
import { templates } from '@calendarmap/engine';

// Available templates
const calendarTemplate = templates['calendar-ics'];
```

### guessMapping(headers, template)

Auto-detects field mappings from CSV headers:

```typescript
const mapping = guessMapping(['Event Title', 'Start Time'], template);
// Returns: { title: 'Event Title', start: 'Start Time', ... }
```

### applyMapping(data, template, mapping)

Converts CSV data using field mappings:

```typescript
const result = applyMapping(csvRows, template, mapping);
// Returns: { headers: string[], rows: any[][] }
```

### validateRows(data, template, mapping)

Validates CSV data and reports issues:

```typescript
const validation = validateRows(csvRows, template, mapping);
// Returns validation results with error details
```

## License

MIT