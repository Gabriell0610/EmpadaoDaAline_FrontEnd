import { baseUrl } from '@/utils/helpers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('itemId');

  const req = await fetch(`${baseUrl()}/itens/${itemId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const res = await req.json();

  if (req.status >= 400) {
    return NextResponse.json({ ...res, success: false });
  }

  return NextResponse.json({ ...res, success: true });
}
