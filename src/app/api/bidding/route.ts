import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';

export default async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Incoming data:', data); // Debug incoming data
    const { projectId, bidAmount, userId } = data;

    if (!projectId || !bidAmount || !userId) {
      console.error('Validation failed:', { projectId, bidAmount, userId });
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Store the bid in the database
    const bid = await prisma.bidding.create({
      data: {
        projectId,
        bidAmount,
        userId,
        user: { connect: { id: userId } },
        product: { connect: { id: projectId } },
        owner: { connect: { id: userId } },
      },
    });
    console.log('Prisma bid creation result:', bid);

    console.log('Bid created:', bid); // Debug created bid
    return new Response(JSON.stringify(bid), { status: 201 }); // Ensure JSON response
  } catch (error) {
    console.error('Error handling request:', (error as Error).message, (error as Error).stack);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
