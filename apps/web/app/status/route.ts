import { NextResponse } from 'next/server';

export async function GET() {
  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const statusData = {
    ok: true,
    lastVerified: today,
    service: "CalendarMap",
    version: "1.0.0",
    endpoints: {
      converter: "/map/calendar-ics",
      docs: "/docs",
      cli: "/cli",
      tools: "/ics-tools"
    },
    health: {
      api: "operational",
      converter: "operational",
      documentation: "operational"
    }
  };

  return NextResponse.json(statusData, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}