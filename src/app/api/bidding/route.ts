/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Incoming Payload:', data);

    const { projectId, userId, bidAmount, ownerId } = data;

    if (!projectId || !userId || !bidAmount || !ownerId) {
      console.error('Validation Failed: Missing required fields', { projectId, userId, bidAmount, ownerId });
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const bid = await prisma.bidding.create({
      data: {
        bidAmount,
        userId,
        productId: projectId,
        ownerId,
      },
    });

    console.log('Bid Created Successfully:', bid);
    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    console.error('API Error:', (error as Error).message);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}
