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

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const idAddress = searchParams.get('idAddress');
  const token = headers().get('authorization');
  const data = await request.json();

  if (!idAddress) {
    const req = await fetch(`${baseUrl()}/users`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res = await req.json();

    if (req.status >= 400) {
      return NextResponse.json({ ...res, success: false, code: req.status });
    }

    return NextResponse.json({ ...res, success: true });
  }

  const req = await fetch(`${baseUrl()}/users/${idAddress}/address`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const res = await req.json();

  if (req.status >= 400) {
    return NextResponse.json({ ...res, success: false, code: req.status });
  }

  return NextResponse.json({ ...res, success: true });
}
