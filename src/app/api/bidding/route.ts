import { prisma } from '../../../lib/prisma';

export default async function POST(req: any) {
  try {
    const data = await req.json();

    // Validate the received data (add necessary validations)
    const { projectId, bidAmount, userId } = data;

    if (!projectId || !bidAmount || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 },
      );
    }

    // Store the bid in the database
    const bid = await prisma.bidding.create({
      data: {
        projectId,
        bidAmount,
        userId,
      },
    });

    return new Response(JSON.stringify(bid), { status: 201 });
  } catch (error) {
    console.error('Error submitting bid:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
