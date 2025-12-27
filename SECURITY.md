# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously at CalendarMap. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do NOT open a public GitHub issue** for security vulnerabilities
2. Use [GitHub Security Advisories](https://github.com/codebruinc/calendarmap-oss/security/advisories/new) to report privately

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Initial response:** Within 48 hours
- **Status update:** Within 7 days
- **Fix timeline:** Depends on severity (critical: ASAP, high: 7 days, medium: 30 days)

## Security Architecture

### Browser-Only Processing

CalendarMap processes CSV files entirely in the browser. Your event data never leaves your device.

- CSV parsing: Client-side (PapaParse)
- ICS generation: Client-side
- File downloads: Generated locally via Blob URLs

## Security Best Practices for Contributors

### Never Commit

- API keys or secrets
- `.env` files (use `.env.example` with placeholders)
- Customer data or PII
- Private keys or certificates

### Code Review Checklist

- [ ] No hardcoded secrets
- [ ] Input validation on all user data
- [ ] No sensitive data in logs
- [ ] Proper error handling (no stack traces to users)
- [ ] Dependencies are up to date

## Dependency Management

We use Dependabot to keep dependencies updated. Security updates are prioritized and merged promptly.

## Acknowledgments

We appreciate security researchers who help keep CalendarMap safe. Responsible disclosures will be acknowledged (with permission) in release notes.
