import { baseUrl } from '@/utils/helpers';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idOrder = searchParams.get('idOrder');

  const token = headers().get('authorization');

  const req = await fetch(`${baseUrl()}/order/${idOrder}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });

  const res = await req.json();

  if (req.status >= 400) {
    return NextResponse.json({ ...res, success: false });
  }

  return NextResponse.json({ ...res, success: true });
}
