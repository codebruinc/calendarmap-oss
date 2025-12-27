# Stable URLs Policy

## Permanent URLs

The following URLs are considered **permanent** and will never change or be removed:

### Primary Converter Interface
- `/map/calendar-ics` - Main CSV to ICS converter interface
- `/map?schema=calendar-ics` - Alternative URL for the same converter

### API Endpoints
- `/status` - Service health check endpoint

## Policy Details

### URL Permanence
- These URLs are guaranteed to remain functional
- Any changes to underlying implementation must maintain backward compatibility
- Redirects will be implemented if URL structure needs to change

### Redirect Enforcement
- Legacy URLs will redirect to canonical forms
- Query parameters are preserved during redirects
- Redirect responses include `301 Moved Permanently` status

### Breaking Changes
- Breaking changes to permanent URLs require major version bump
- 12-month deprecation notice for any breaking changes
- Migration path must be provided for all breaking changes

## Implementation Notes

### Next.js Routing
- Primary routes are implemented as pages in `/app/map/`
- Query parameter routing is handled in page components
- Redirects are implemented in `next.config.js` or middleware

### Testing
- Monthly canary tests verify URL availability
- Automated testing includes both URL forms
- Response status and content validation

### Monitoring
- Error tracking on permanent URLs
- Alert threshold: >1% error rate on permanent URLs
- Response time monitoring with 2s SLA

## Examples

Valid permanent URLs:
```
https://calendarmap.app/map/calendar-ics
https://calendarmap.app/map?schema=calendar-ics
https://calendarmap.app/status
```

Legacy URLs that should redirect:
```
https://calendarmap.app/converter → /map/calendar-ics
https://calendarmap.app/csv-to-ics → /map/calendar-ics
```

## Responsibilities

### Development Team
- Ensure new features don't break permanent URLs
- Implement redirects for any URL structure changes
- Update tests when adding new permanent URLs

### Operations Team
- Monitor permanent URL performance
- Set up alerting for 4xx/5xx errors on permanent URLs
- Maintain redirect mappings

## Last Updated
2025-09-08

## Review Schedule
Quarterly review of permanent URL performance and policy compliance.