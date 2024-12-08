/* eslint-disable import/prefer-default-export */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = async () => {
  try {
    const reviews = await prisma.reviews.findMany();
    console.log('Fetched reviews from database:', reviews);
    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reviews:', error.message, error.stack);
    return NextResponse.json({ error: 'Failed to fetch reviews', details: error.message }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    let { userName, item, rating, contact, reviewText, profileId } = body;

    console.log('Received payload:', body);

    // Validate input fields
    if (!userName || !item || !contact || !reviewText) {
      console.error('Validation failed:', { userName, item, contact, reviewText, profileId });
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
    }

    // Validate and convert profileId
    if (profileId) {
      const parsedProfileId = parseInt(profileId, 10);
      if (isNaN(parsedProfileId)) {
        console.error('Invalid profileId:', profileId);
        return NextResponse.json({ error: 'Invalid profileId' }, { status: 400 });
      }
      profileId = parsedProfileId;
    }

    const newReview = await prisma.reviews.create({
      data: {
        userName,
        item,
        rating: rating || null,
        contact,
        reviewText,
        profileId: profileId || null, // Handle nullable profileId
      },
    });

    console.log('New review created successfully:', newReview);
    return NextResponse.json(newReview, { status: 200 });
  } catch (error: any) {
    console.error('Error during review submission:', error.message, error.stack);
    return NextResponse.json({ error: 'Failed to submit review', details: error.message }, { status: 500 });
  }
};
