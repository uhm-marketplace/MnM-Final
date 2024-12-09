/* eslint-disable import/prefer-default-export */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ReviewSchema } from '@/lib/validationSchemas';

export const GET = async () => {
  try {
    const reviews = await prisma.reviews.findMany();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', details: (error as Error).message },
      { status: 500 },
    );
  }
};

export const POST = async (req: { json: () => any; }) => {
  try {
    const body = await req.json();
    await ReviewSchema.validate(body);

    const { userName, item, rating, reviewText, contact } = body;
    const newReview = await prisma.reviews.create({
      data: {
        userName,
        item,
        rating,
        reviewText,
        contact,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error posting review:', error);
    return NextResponse.json(
      { error: 'Failed to post review', details: (error as Error).message },
      { status: 400 },
    );
  }
};
