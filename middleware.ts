import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n-navigation';

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isAdminRoute = url.pathname.includes('/admin');
  const isLoginRoute = url.pathname.includes('/admin/login');
  
  if (isAdminRoute && !isLoginRoute) {
    const session = req.cookies.get('zeus_admin_session');
    if (!session || session.value !== 'true') {
      const localeMatch = url.pathname.match(/^\/(en|ar)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
