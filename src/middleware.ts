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
  ];

  if (accessToken) {
    const decoded = decode(accessToken.value) as JwtCustomPayload | null;
    if (
      decoded?.role !== AccessProfile.ADMIN &&
      pathname.startsWith('/admin')
    ) {
      return NextResponse.redirect(new URL('/client', req.url));
    }
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
