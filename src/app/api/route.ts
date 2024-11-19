/* eslint-disable import/prefer-default-export */
// src/app/api/route.ts
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
    });
  }

  return NextResponse.json({ authenticated: !!session });
}
