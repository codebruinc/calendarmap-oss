'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is the canonical route for calendar-ics
// We redirect to the main /map page with the schema parameter, preserving hash
export default function CalendarICSPage() {
  const router = useRouter();

  useEffect(() => {
    // Get the current hash (including #) from client-side
    const hash = window.location.hash;
    
    // Redirect while preserving the hash fragment
    router.replace(`/map?schema=calendar-ics${hash}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading calendar converter...</p>
      </div>
    </div>
  );
}