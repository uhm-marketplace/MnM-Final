/* eslint-disable import/prefer-default-export */
// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    console.error('Error: Email parameter is missing in API request.');
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 },
    );
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!profile) {
      console.error(`Error: Profile not found for email: ${email}`);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile from database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 },
    );
  }
}
