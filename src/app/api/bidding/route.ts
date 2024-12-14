import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { bidAmount, productId, ownerId } = await req.json();

    // Validate required fields
    if (typeof bidAmount !== 'number' || typeof productId !== 'number') {
      return NextResponse.json(
        { error: 'Invalid data: bidAmount and productId must be numbers' },
        { status: 400 },
      );
    }

    // Save the bid to the database
    const newBid = await prisma.bidding.create({
      data: {
        bidAmount, // Float
        userId: parseInt(session.user.id, 10), // Int
        productId, // Int
        ownerId: ownerId || undefined, // Int or undefined
      },
    });

    return NextResponse.json(newBid, { status: 201 });
  } catch (error) {
    console.error('Error creating bid:', error);
    return NextResponse.json(
      { error: 'Failed to create bid' },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    // Fetch all bids for a product
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Missing required field: productId' },
        { status: 400 },
      );
    }

    const bids = await prisma.bidding.findMany({
      where: { productId: parseInt(productId, 10) },
    });

    return NextResponse.json(bids, { status: 200 });
  } catch (error) {
    console.error('Error fetching bids:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bids' },
      { status: 500 },
    );
  }
}
