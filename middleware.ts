import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security and content type headers
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Content-Type', 'application/json');
  }
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Content-Disposition', 'inline');

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/game/play/:path*'],
};
