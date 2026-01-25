import { NextRequest, NextResponse } from 'next/server';
import { baseUrl } from './utils/helpers';

export async function middleware(req: NextRequest) {
  const res = await fetch(`${baseUrl()}/auth/me`, {
    headers: {
      cookie: req.headers.get('cookie') ?? '',
    },
  });

  if (res.status === 401) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const user = await res.json();

  if (req.nextUrl.pathname.startsWith('/admin') && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/client', req.url));
  }

  return NextResponse.next();
}
