/* eslint-disable import/prefer-default-export */
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bidAmount, userId, productId } = body;

    console.log('Received userId:', userId);
    // Validate input types
    if (typeof bidAmount !== 'number' || Number.isNaN(bidAmount)) {
      console.error('Invalid bidAmount:', bidAmount);
      return NextResponse.json({ error: 'Invalid bidAmount' }, { status: 400 });
    }

    if (typeof userId !== 'number' || Number.isNaN(userId)) {
      console.error('Invalid userId:', userId);
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    if (typeof productId !== 'number' || Number.isNaN(productId)) {
      console.error('Invalid productId:', productId);
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
    }

    // Validate productId exists
    const projectExists = await prisma.project.findUnique({
      where: { id: productId },
    });

    if (!projectExists) {
      console.error('Invalid productId:', productId);
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
    }

    // Insert bid
    const newBid = await prisma.bidding.create({
      data: {
        bidAmount,
        userId,
        productId,
      },
    });

    console.log('Bid stored successfully:', newBid);
    return NextResponse.json(newBid, { status: 201 });
  } catch (prismaError) {
    console.error('Prisma error:', JSON.stringify(prismaError, null, 2));
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
