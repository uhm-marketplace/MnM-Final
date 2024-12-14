/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Handle POST requests
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Incoming Request Data:', data);

    const projectId = parseInt(data.projectId, 10);
    const userId = parseInt(data.userId, 10);
    const bidAmount = parseFloat(data.bidAmount);

    if (!projectId || !userId || !bidAmount) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    // Check if user and project exist
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    const projectExists = await prisma.project.findUnique({ where: { id: projectId } });

    if (!userExists || !projectExists) {
      return NextResponse.json({ error: 'Invalid userId or projectId' }, { status: 404 });
    }

    const productId = parseInt(data.productId, 10);
    const ownerId = parseInt(data.ownerId, 10);

    if (!productId || !ownerId) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const bid = await prisma.bidding.create({
      data: {
        bidAmount,
        userId, // Directly provide userId
        productId, // Directly provide productId
        ownerId, // Directly provide ownerId
      },
    });

    console.log('Bid Created Successfully:', bid);
    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    console.error('API Error:', (error as Error).message, (error as Error).stack);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}
