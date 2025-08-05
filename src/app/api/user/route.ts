import { baseUrl } from '@/utils/helpers';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const token = headers().get('authorization');

  console.log('TOKEN', JSON.stringify(token));

  const req = await fetch(`${baseUrl()}/users/me`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const res = await req.json();

  if (req.status >= 400) {
    return NextResponse.json({ ...res, success: false, code: req.status });
  }

  return NextResponse.json({ ...res, success: true });
}
