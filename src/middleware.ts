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

  const decoded = accessToken
    ? (decode(accessToken.value) as JwtCustomPayload | null)
    : null;

  const isAuthPage = pathname === '/login' || pathname === '/register';

  // usuário autenticado tentando acessar login/register
  if (decoded && isAuthPage) {
    return NextResponse.redirect(
      new URL(
        decoded.role === AccessProfile.ADMIN ? '/admin' : '/client',
        req.url,
      ),
    );
  }

  if (!decoded && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (decoded?.role !== AccessProfile.ADMIN && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/client', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
