import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Allow access to the login page itself
  if (url.pathname === '/admin/login') {
    return NextResponse.next();
  }

  const session = req.cookies.get('zeus_admin_session');

  if (!session || session.value !== 'true') {
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
