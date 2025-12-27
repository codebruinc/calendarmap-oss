import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Redirect legacy converter URLs to stable URLs (STABLE URLs POLICY)
  const redirects: Record<string, string> = {
    '/converter': '/map/calendar-ics',
    '/csv-to-ics': '/map/calendar-ics',
    '/convert': '/map/calendar-ics',
    '/tool': '/map/calendar-ics',
  };

  // Check for direct redirects
  if (redirects[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = redirects[pathname];
    return NextResponse.redirect(url, 301);
  }

  // Ensure /map?schema=calendar-ics works (STABLE URL)
  if (pathname === '/map') {
    const schema = searchParams.get('schema');
    if (!schema) {
      // Default to calendar-ics if no schema specified
      const url = request.nextUrl.clone();
      url.pathname = '/map/calendar-ics';
      return NextResponse.redirect(url, 302);
    }
    // schema=calendar-ics is a stable URL, allow it to proceed
  }

  const response = NextResponse.next();
  
  // Add cache headers for stable URLs
  if (pathname === '/map/calendar-ics' || 
      pathname === '/status' || 
      (pathname === '/map' && searchParams.get('schema') === 'calendar-ics')) {
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  }
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for Next.js
    "style-src 'self' 'unsafe-inline'", // Required for Tailwind
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.stripe.com https://checkout.stripe.com",
    "frame-src 'self' https://checkout.stripe.com",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "script-src-attr 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon (favicon files)
     */
    '/((?!api|_next/static|_next/image|favicon).*)',
  ],
};