// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { decode, JwtPayload } from 'jsonwebtoken';
import { AccessProfile } from './constants/enums/AccessProfile';

interface JwtCustomPayload extends JwtPayload {
  role: AccessProfile;
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token');
  const pathname = req.nextUrl.pathname;

  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgetPassword',
    '/newPassword',
    '/menu',
  ];

  if (accessToken) {
    const decoded = decode(accessToken.value) as JwtCustomPayload | null;

    if (pathname === '/login' || pathname === '/register') {
      if (decoded?.role === AccessProfile.ADMIN) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.redirect(new URL('/client', req.url));
    }

    if (
      decoded?.role !== AccessProfile.ADMIN &&
      pathname.startsWith('/admin')
    ) {
      return NextResponse.redirect(new URL('/client', req.url));
    }
  }

  if (!accessToken && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
