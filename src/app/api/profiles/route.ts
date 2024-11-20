/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany();
    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 },
    );
  }
}
