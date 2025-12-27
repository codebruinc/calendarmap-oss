# CalendarMap OSS

Open source CSV to ICS calendar converter. Convert spreadsheets to calendar files in your browser - no uploads, no tracking.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- **100% browser-based** - Your data never leaves your device
- **No file size limits** - Process any size calendar
- **Smart auto-mapping** - Automatically detects date, time, and event fields
- **Timezone support** - Handles multiple timezones and all-day events
- **Validation** - Shows specific errors and suggests fixes
- **No signup required** - Start converting immediately
- **CLI included** - Perfect for automation and scripting
- **RFC 5545 compliant** - Works with Google Calendar, Outlook, Apple Calendar

## Quick Start

### Self-Host

```bash
git clone https://github.com/codebruinc/calendarmap-oss.git
cd calendarmap-oss
npm install
npm run dev
```

### CLI

```bash
npm install -g calendarmap-cli
calendarmap convert events.csv -o calendar.ics
```

## Privacy

CalendarMap processes CSV files entirely in your browser. Your event data never leaves your device.

- No analytics or tracking
- No cookies
- No server uploads
- No accounts required

## CSV Format Example

```csv
Title,Start,End,All Day,Location,Description
Team Meeting,2025-01-25 09:00,2025-01-25 10:00,FALSE,Conference Room A,Weekly standup
Product Launch,2025-01-30,2025-01-30,TRUE,San Francisco,Company-wide launch event
```

## Supported Date Formats

- `2025-01-15 09:00` (ISO)
- `01/15/2025 9:00 AM` (US)
- `15/01/2025 09:00` (EU)
- `January 15, 2025` (long form)

## Project Structure

```
calendarmap-oss/
├── apps/web/          # Next.js web application
├── packages/
│   ├── engine/        # Core mapping and ICS generation
│   └── cli/           # Command-line interface
├── functions/         # Optional serverless functions (contact form)
└── docs/              # Documentation
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Type check
npm run typecheck
```

## Deployment Options

### Static Export (Recommended)

```bash
npm run build
# Deploy the out/ folder to any static host
```

Works with: Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3, etc.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run `npm run test` and `npm run lint`
5. Commit: `git commit -am 'Add feature'`
6. Push: `git push origin feature-name`
7. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- **GitHub**: https://github.com/codebruinc/calendarmap-oss
- **Issues**: https://github.com/codebruinc/calendarmap-oss/issues

---

Built by [CodeBru](https://codebru.com)
