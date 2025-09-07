// import { baseUrl } from '@/utils/helpers'

import { baseUrl } from '@/utils/helpers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  const req = await fetch(`${baseUrl()}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const res = await req.json();

  if (req.status >= 400) return NextResponse.json({ ...res, success: false });

  return NextResponse.json({ ...res, success: true });
}
