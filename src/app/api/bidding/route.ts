import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export default async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Incoming Request:', data);

    const { projectId, bidAmount, userId } = data;

    // Validate incoming data
    if (!projectId || !bidAmount || !userId) {
      console.error('Validation Error:', { projectId, bidAmount, userId });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user and project exist
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    const projectExists = await prisma.project.findUnique({ where: { id: projectId } });

    if (!userExists || !projectExists) {
      console.error('Not Found:', { userId, projectId });
      return NextResponse.json({ error: 'Invalid userId or projectId' }, { status: 404 });
    }

    // Create the bid in the database
    const bid = await prisma.bidding.create({
      data: {
        bidAmount,
        userId,
        user: { connect: { id: userId } },
      },
    });

    console.log('Bid Created Successfully:', bid);
    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    console.error('Unhandled API Error:', (error as Error).message, (error as Error).stack);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 },
    );
  }
}
