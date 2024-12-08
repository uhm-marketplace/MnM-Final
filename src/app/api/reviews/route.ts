/* eslint-disable import/prefer-default-export */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { userName, item, rating, contact, reviewText, profileId } = body;

    console.log('Received payload:', body);

    // Validate required fields
    if (!userName || !item || !contact || !reviewText || !profileId) {
      console.error('Validation failed:', { userName, item, contact, reviewText, profileId });
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
    }

    // Check for existing review
    const existingReview = await prisma.reviews.findFirst({
      where: {
        profileId,
        userName,
      },
    });

    if (existingReview) {
      console.error('Duplicate review detected for profileId:', profileId);
      return NextResponse.json({ error: 'A review already exists for this profileId' }, { status: 400 });
    }

    // Create a new review
    const newReview = await prisma.reviews.create({
      data: {
        userName,
        item,
        rating: rating || null,
        contact,
        reviewText,
        profileId,
      },
    });

    console.log('New review created successfully:', newReview);
    return NextResponse.json(newReview, { status: 200 });
  } catch (error: any) {
    console.error('Error during review submission:', error.message, error.stack);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
};
