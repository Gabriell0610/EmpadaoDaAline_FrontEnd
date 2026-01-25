import { baseUrl } from '@/utils/helpers';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { body, method, url } = await request.json();

  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const req = await fetch(`${baseUrl()}/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader, // 👈 repassa cookies
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-cache',
  });

  const response = await req.json();

  if (req.status >= 400) {
    return NextResponse.json(
      {
        ...response,
        success: false,
      },
      { status: req.status },
    );
  }

  return NextResponse.json(
    { ...response, success: true },
    { status: req.status },
  );
}
