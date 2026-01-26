import { NextRequest, NextResponse } from 'next/server';
import { baseUrl } from './utils/helpers';
import { AccessProfile } from './constants/enums/AccessProfile';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 🔓 Rotas públicas (NÃO passam por auth)
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgetPassword') ||
    pathname.startsWith('/newPassword')
  ) {
    return NextResponse.next();
  }

  const res = await fetch(`${baseUrl()}/users/me`, {
    headers: {
      cookie: req.headers.get('cookie') ?? '',
    },
  });

  if (res.status === 401) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const user = await res.json();

  if (pathname.startsWith('/admin') && user.role !== AccessProfile.ADMIN) {
    return NextResponse.redirect(new URL('/client', req.url));
  }

  return NextResponse.next();
}
