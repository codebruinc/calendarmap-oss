# Contributing to CalendarMap

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Development Setup

```bash
# Clone the repository
git clone https://github.com/codebruinc/calendarmap-oss.git
cd calendarmap-oss

# Install dependencies and build the engine first (the web app depends on it)
cd packages/engine && npm install && npm run build

# Install and start the web app
cd ../../apps/web && npm install && npm run dev
```

The web app will be available at `http://localhost:3000`.

From the repo root, `npm run build` builds the engine and the web app in the
right order.

> **Note:** each package manages its own dependencies with `npm install` — this
> is not a pnpm/npm workspace, so there is no root-level install step.

## 📦 Project Structure

- **`packages/engine/`** - Core TypeScript engine (CSV mapping, ICS generation, validation)
- **`packages/cli/`** - Node.js command-line interface
- **`apps/web/`** - Next.js web application
- **`functions/`** - Cloudflare Pages Functions
- **Sample CSVs** - Located in `sample-data/` and `test-data/`

### Engine layout

| File | Responsibility |
| --- | --- |
| `src/mapping.ts` | Maps incoming CSV columns onto event fields |
| `src/ics-generator.ts` | Emits RFC 5545 ICS output |
| `src/ics-validator.ts` | Validates generated calendars |
| `src/ics-qa-suite.ts` | Golden-case QA suite and round-trip checks |
| `src/templates/` | Per-source column templates |

## 🎯 How to Add a New Input Template

Templates teach CalendarMap how to recognise the columns of a given CSV export.

### 1. Create the template

Add your template to `packages/engine/src/templates/`, following the shape in
`packages/engine/src/types.ts`. Use `synonyms` generously — that is what makes
column auto-detection work on real-world exports.

### 2. Export it

Register the new template in `packages/engine/src/templates/index.ts` so the
engine and CLI can both resolve it by key.

### 3. Add a sample CSV

Drop a representative CSV into `sample-data/` so the behaviour is reproducible.
Keep it small and free of real personal data.

### 4. Test everything

```bash
# Build the engine, then run the ICS QA + round-trip suite
cd packages/engine
npm run build
npm run test:qa

# Test the CLI against your sample
cd ../cli && npm install && npm run build

# Test the web app
cd ../../apps/web && npm run dev
```

## 🧪 Testing

### Engine tests

The QA suite is the engine's real test suite — golden cases, deliberately
invalid "red" cases, and round-trip stability checks:

```bash
cd packages/engine
npm run build     # test:qa runs against dist/, so build first
npm run test:qa
```

> **Heads up:** `npm run test` invokes vitest, but there are currently no
> `*.test.ts` files, so it exits non-zero. New unit tests are welcome — add them
> as `src/*.test.ts` and vitest will pick them up.

### Manual testing

Upload a CSV through the web UI, convert it, and open the resulting `.ics` in at
least one real calendar client (Google Calendar, Apple Calendar, or Outlook).
Round-tripping cleanly in a real client is the bar — a file that merely parses
is not enough.

## 📝 Code Style

- TypeScript throughout; `npm run lint` (`tsc --noEmit`) must pass
- Match the conventions of the surrounding file
- Prefer small, well-named functions over comments explaining long ones

## 🚨 Important Guidelines

### Privacy & Security

- Conversion happens **client-side** — never add a code path that uploads a
  user's calendar data to a server
- Don't log file contents or event details
- No new third-party runtime dependencies without discussion

### Correctness

- ICS output must stay RFC 5545 compliant
- Be rigorous about timezones and all-day events; they are the most common
  source of real-world bugs
- Add a golden case to the QA suite for any bug you fix

### Compatibility

- Target the Node version in `.nvmrc`
- Keep output compatible with Google Calendar, Apple Calendar, and Outlook

## 🔄 Development Workflow

1. Fork the repo and create a branch off `main`
2. Make your change, with tests
3. Run `npm run test:qa` and `npm run lint` in `packages/engine`
4. Open a pull request describing the change and how you verified it

## 📋 Pull Request Checklist

- [ ] Engine builds without errors (`cd packages/engine && npm run build`)
- [ ] QA suite passes (`npm run test:qa`)
- [ ] Type check passes (`npm run lint`)
- [ ] Web app builds (`cd apps/web && npm run build`)
- [ ] Generated `.ics` verified in a real calendar client

## 🆘 Getting Help

- 🐛 [Report Issues](https://github.com/codebruinc/calendarmap-oss/issues)
- 💬 [GitHub Discussions](https://github.com/codebruinc/calendarmap-oss/discussions)

## 🎉 Recognition

Contributors are credited in release notes. Thanks for helping make CalendarMap
better!
