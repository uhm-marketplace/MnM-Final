import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export default async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bidAmount, userId, productId } = body;

    if (!bidAmount || !userId || !productId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Store the bid in the database
    const newBid = await prisma.bidding.create({
      data: {
        bidAmount,
        userId,
        productId,
      },
    });

    return NextResponse.json(newBid, { status: 201 });
  } catch (error) {
    console.error('Error storing bid:', error);
    return NextResponse.json({ error: 'Failed to store bid' }, { status: 500 });
  }
}
