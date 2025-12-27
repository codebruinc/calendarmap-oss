import type { Metadata } from 'next'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'CalendarMap — Convert CSV to ICS Calendar in 30 seconds',
  description: 'Drop your CSV events, get an ICS calendar file. Works with Google Calendar & Outlook. No login. Runs in your browser.',
  keywords: ['CSV', 'ICS', 'calendar', 'events', 'Google Calendar', 'Outlook', 'iCalendar', 'data conversion', 'no-code'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'CalendarMap — CSV to ICS Calendar Converter',
    description: 'Convert CSV events to ICS calendar format in 30 seconds. No login. Runs in your browser.',
    siteName: 'CalendarMap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalendarMap — CSV to ICS Calendar Converter',
    description: 'Convert CSV events to ICS calendar format in 30 seconds. No login. Runs in your browser.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Add your own analytics here if desired */}
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
