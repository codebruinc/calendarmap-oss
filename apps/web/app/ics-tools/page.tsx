import type { Metadata } from 'next';
import ICSToolsClient from './ICSToolsClient';

export const metadata: Metadata = {
  title: 'ICS Tools — Merge and Inspect Calendar Files',
  description: 'Free browser-based tools to merge, inspect, and validate ICS calendar files. Nothing is uploaded.',
  alternates: { canonical: '/ics-tools' },
  openGraph: {
    title: 'ICS Tools — Merge and Inspect Calendar Files',
    description: 'Free browser-based tools to merge, inspect, and validate ICS calendar files. Nothing is uploaded.',
    url: 'https://calendarmap.app/ics-tools',
    siteName: 'CalendarMap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICS Tools — Merge and Inspect Calendar Files',
    description: 'Free browser-based tools to merge, inspect, and validate ICS calendar files. Nothing is uploaded.',
  },
};

export default function Page() {
  return <ICSToolsClient />;
}
