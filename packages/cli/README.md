# CalendarMap CLI

[![npm version](https://badge.fury.io/js/calendarmap-cli.svg)](https://www.npmjs.com/package/calendarmap-cli)

Command-line tool to convert CSV events to ICS calendar format with smart field mapping and validation.

## Installation

```bash
npm install -g calendarmap-cli
```

## Quick Start

```bash
# 1. Generate a mapping from your CSV headers
calendarmap guess --schema calendar-ics < events.csv > mapping.json

# 2. Convert CSV to ICS using the mapping
calendarmap map --schema calendar-ics --mapping mapping.json < events.csv > calendar.ics
```

## Commands

### `guess` - Generate Field Mapping

Auto-detects your CSV columns and creates a mapping file:

```bash
calendarmap guess --schema calendar-ics --input events.csv --output mapping.json
```

Or using pipes:
```bash
calendarmap guess --schema calendar-ics < events.csv > mapping.json
```

### `map` - Convert CSV to ICS

Converts CSV data using a mapping file:

```bash
calendarmap map --schema calendar-ics --mapping mapping.json --input events.csv --output calendar.ics
```

Or using pipes:
```bash
calendarmap map --schema calendar-ics --mapping mapping.json < events.csv > calendar.ics
```

### `validate` - Check Your Data

Validates CSV data before conversion:

```bash
calendarmap validate --schema calendar-ics --mapping mapping.json --input events.csv
```

## CSV Format

Your CSV should have columns for:
- **Title/Summary** (required)
- **Start Date/Time** (required)
- **End Date/Time** (optional - defaults to 1 hour)
- **Location** (optional)
- **Description** (optional)

Example CSV:
```csv
Event Name,Start Date,End Date,Location,Notes
Team Meeting,2024-01-15 10:00,2024-01-15 11:00,Conference Room A,Weekly sync
Project Demo,2024-01-20 14:00,2024-01-20 15:30,Main Hall,Show progress
```

## Why Use the CLI?

- ✅ **No file size limits** - Process millions of events
- ✅ **Privacy first** - All processing happens locally
- ✅ **Automation ready** - Perfect for scripts and workflows
- ✅ **Batch processing** - Handle multiple files
- ✅ **RFC 5545 compliant** - Works with all calendar apps

## Examples

### Conference Schedule
```bash
# Convert conference sessions
calendarmap guess --schema calendar-ics < conference.csv > conf-mapping.json
calendarmap map --schema calendar-ics --mapping conf-mapping.json < conference.csv > conference2024.ics
```

### Team Calendar
```bash
# Process with validation
calendarmap validate --schema calendar-ics --mapping team-mapping.json < team-events.csv
calendarmap map --schema calendar-ics --mapping team-mapping.json < team-events.csv > team.ics
```

### Automation Script
```bash
#!/bin/bash
for file in *.csv; do
    name=$(basename "$file" .csv)
    calendarmap guess --schema calendar-ics < "$file" > "$name-mapping.json"
    calendarmap map --schema calendar-ics --mapping "$name-mapping.json" < "$file" > "$name.ics"
done
```

## Web Version

For a user-friendly interface, try the web version at [calendarmap.app](https://calendarmap.app) - perfect for one-off conversions and files under 2,000 events.

## Support

- 📖 [Documentation](https://calendarmap.app/docs)
- 🐛 [Report Issues](https://github.com/codebruinc/calendarmap/issues)
- 💬 [GitHub Discussions](https://github.com/codebruinc/calendarmap/discussions)

## License

MIT - see [LICENSE](../../LICENSE) file.