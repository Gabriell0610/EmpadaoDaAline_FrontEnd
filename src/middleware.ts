// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { decode, JwtPayload } from 'jsonwebtoken';
import { AccessProfile } from './constants/enums/AccessProfile';

interface JwtCustomPayload extends JwtPayload {
  role: AccessProfile;
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token');
  const refreshToken = req.cookies.get('refresh_token');
  const pathname = req.nextUrl.pathname;

  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgetPassword',
    '/newPassword',
    '/menu',
    '/doubt',
    '/terms',
    '/not-found',
  ];

  const decoded = accessToken
    ? (decode(accessToken.value) as JwtCustomPayload | null)
    : null;

  const isTokenExpired = decoded?.exp ? decoded.exp * 1000 < Date.now() : true;

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

  // proteção de admin (token precisa ser válido)
  if (pathname.startsWith('/admin')) {
    // sem token → bloqueia direto
    if (!decoded) {
      return NextResponse.redirect(new URL('/client', req.url));
    }

    // token expirado
    if (isTokenExpired) {
      // tem refresh → deixa seguir para renovar
      if (refreshToken) {
        return NextResponse.next();
      }

      // sem refresh → bloqueia
      return NextResponse.redirect(new URL('/client', req.url));
    }

    // token válido → checa role
    if (decoded.role !== AccessProfile.ADMIN) {
      return NextResponse.redirect(new URL('/client', req.url));
    }
  }

  // token expirado mas tem refresh_token — deixa passar para o client fazer o refresh
  if (isTokenExpired && refreshToken && !publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if ((!decoded || isTokenExpired) && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
