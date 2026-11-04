import type { Metadata } from 'next';
import CalendarICSRedirect from './CalendarICSRedirect';

// Canonical converter URL per STABLE_URLS.md — the client component keeps the
// existing redirect to /map?schema=calendar-ics (and preserves the hash), so
// only the metadata is added here.
export const metadata: Metadata = {
  title: 'CSV to ICS Converter — CalendarMap',
  description: 'Convert CSV events to an ICS calendar file in your browser. Works with Google Calendar, Outlook, and Apple Calendar. No login required.',
  alternates: { canonical: '/map/calendar-ics' },
  openGraph: {
    title: 'CSV to ICS Converter — CalendarMap',
    description: 'Convert CSV events to an ICS calendar file in your browser. Works with Google Calendar, Outlook, and Apple Calendar. No login required.',
    url: 'https://calendarmap.app/map/calendar-ics',
    siteName: 'CalendarMap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSV to ICS Converter — CalendarMap',
    description: 'Convert CSV events to an ICS calendar file in your browser. Works with Google Calendar, Outlook, and Apple Calendar. No login required.',
  },
};

export default function Page() {
  return <CalendarICSRedirect />;
}
