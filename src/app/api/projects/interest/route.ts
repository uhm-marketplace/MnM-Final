/* eslint-disable import/prefer-default-export */
// app/api/projects/interest/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, profileId } = body;

    if (!projectId || !profileId) {
      console.error('Missing projectId or profileId:', { projectId, profileId });
      return NextResponse.json(
        { error: 'Missing projectId or profileId' },
        { status: 400 },
      );
    }

    const existingInterest = await prisma.projectBuyer.findFirst({
      where: { projectId, profileId },
    });

    if (existingInterest) {
      console.log('Removing interest for:', { projectId, profileId });
      await prisma.projectBuyer.delete({
        where: { id: existingInterest.id },
      });
      return NextResponse.json({ interested: false });
    }
    console.log('Adding interest for:', { projectId, profileId });
    await prisma.projectBuyer.create({
      data: { projectId, profileId },
    });
    return NextResponse.json({ interested: true });
  } catch (error) {
    console.error('Error toggling interest:', error);
    return NextResponse.json(
      { error: 'Failed to toggle interest' },
      { status: 500 },
    );
  }
}
