import { baseUrl } from '@/utils/helpers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { body, method, token, url } = await request.json();

  const req = await fetch(`${baseUrl()}/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
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
