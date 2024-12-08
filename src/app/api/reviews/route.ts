/* eslint-disable import/prefer-default-export */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = async () => {
  try {
    const reviews = await prisma.reviews.findMany();
    console.log('Fetched reviews from database:', reviews);
    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reviews:', error.message);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { userName, item, rating, contact, reviewText, profileId } = body;

    console.log('Received payload:', body);

    if (!userName || !item || !contact || !reviewText) {
      console.error('Validation failed:', { userName, item, contact, reviewText, profileId });
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
    }

    const newReview = await prisma.reviews.create({
      data: {
        userName,
        item,
        rating: rating || null,
        contact,
        reviewText,
        profileId: profileId || null, // Now supports null
      },
    });

    console.log('New review created successfully:', newReview);
    return NextResponse.json(newReview, { status: 200 });
  } catch (error: any) {
    console.error('Error during review submission:', error.message);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
};
