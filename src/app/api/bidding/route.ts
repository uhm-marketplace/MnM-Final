/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Handle POST requests
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { projectId, bidAmount, userId } = data;

    // Validate input
    if (!projectId || !bidAmount || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user and project existence
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    const projectExists = await prisma.project.findUnique({ where: { id: projectId } });

    if (!userExists || !projectExists) {
      return NextResponse.json({ error: 'Invalid userId or projectId' }, { status: 404 });
    }

    // Create bid
    const bid = await prisma.bidding.create({
      data: {
        bidAmount,
        userId,
        user: { connect: { id: userId } },
        product: { connect: { id: projectId } }, // Use the relation "product"
        owner: { connect: { id: userId } }, // Required "owner" field
      },
    });

    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}
