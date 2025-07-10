import { baseUrl } from '@/utils/helpers';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  const token = headers().get('authorization');

  const req = await fetch(`${baseUrl()}/cart`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const res = await req.json();

  if (req.status >= 400) {
    return NextResponse.json({ ...res, success: false });
  }

  return NextResponse.json({ ...res, success: true });
}

export async function GET() {
  const token = headers().get('authorization');

  const req = await fetch(`${baseUrl()}/cart`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const res = await req.json();

  if (req.status >= 400) {
    return NextResponse.json({ ...res, success: false });
  }

  return NextResponse.json({ ...res, success: true });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('itemId');
  const act = searchParams.get('action');
  const token = headers().get('authorization');

  if (act && act === 'increment') {
    const req = await fetch(`${baseUrl()}/cart/item/${itemId}/increment`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const res = await req.json();

    if (req.status >= 400) {
      return NextResponse.json({ ...res, success: false });
    }

    return NextResponse.json({ ...res, success: true });
  } else {
    const req = await fetch(`${baseUrl()}/cart/item/${itemId}/decrement`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const res = await req.json();

    if (req.status >= 400) {
      return NextResponse.json({ ...res, success: false });
    }

    return NextResponse.json({ ...res, success: true });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('itemId');
  const token = headers().get('authorization');

  const req = await fetch(`${baseUrl()}/cart/item/${itemId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const res = await req.json();

  if (req.status >= 400) {
    return NextResponse.json({ ...res, success: false });
  }

  return NextResponse.json({ ...res, success: true });
}
