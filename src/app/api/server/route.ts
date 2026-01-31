import { baseUrl } from '@/utils/helpers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { body, method, url } = await request.json();

  const req = await fetch(`${baseUrl()}/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-cache',
    credentials: 'include',
  });

  const response = await req.json();

  if (req.status >= 400) {
    return NextResponse.json(
      {
        ...response,
        success: false,
        code: req.status,
      },
      { status: req.status },
    );
  }

  return NextResponse.json(
    { ...response, success: true },
    { status: req.status },
  );
}
