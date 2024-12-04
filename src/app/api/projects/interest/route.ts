/* eslint-disable import/prefer-default-export */
// app/api/projects/interest/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.projectId || !body.profileId) {
      return NextResponse.json(
        { error: 'Missing projectId or profileId' },
        { status: 400 },
      );
    }

    const existingInterest = await prisma.projectBuyer.findFirst({
      where: {
        projectId: Number(body.projectId),
        profileId: Number(body.profileId),
      },
    });

    if (existingInterest) {
      // Remove interest if already exists
      await prisma.projectBuyer.delete({
        where: { id: existingInterest.id },
      });
      return NextResponse.json({ message: 'Interest removed' });
    }
    // Add new interest
    await prisma.projectBuyer.create({
      data: {
        projectId: Number(body.projectId),
        profileId: Number(body.profileId),
      },
    });
    return NextResponse.json({ message: 'Interest added' });
  } catch (error) {
    console.error('Error handling project interest:', error);
    return NextResponse.json(
      { error: 'Failed to update interest' },
      { status: 500 },
    );
  }
}
