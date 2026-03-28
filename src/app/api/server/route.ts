import { baseUrl } from '@/utils/helpers';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { body, method, url } = await request.json();

  const cookieStore = await cookies();
  const hasRefreshToken = !!cookieStore.get('refresh_token');
  const cookieHeader = cookieStore.toString();

  const req = await fetch(`${baseUrl()}/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-cache',
  });

  const response = await req.json();

  const res = NextResponse.json(
    {
      ...response,
      success: req.status < 400,
      code: req.status,
      canRefresh: hasRefreshToken,
    },
    { status: req.status },
  );

  const setCookies = req.headers.getSetCookie();

  if (setCookies.length > 0) {
    setCookies.forEach((cookie) => {
      res.headers.append('set-cookie', cookie);
    });
  }

  return res;
}
