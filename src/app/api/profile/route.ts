/* eslint-disable import/prefer-default-export */
// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  // If no email parameter, return all profiles
  if (!email) {
    try {
      const profiles = await prisma.profile.findMany();
      profiles.sort((a, b) => a.email.localeCompare(b.email));
      return NextResponse.json(profiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profiles' },
        { status: 500 },
      );
    }
  }

  // If email parameter exists, find specific profile
  try {
    const profile = await prisma.profile.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 },
    );
  }
}
