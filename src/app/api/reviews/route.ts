import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userName, item, rating, contact, reviewText, profileId } = req.body;

    // Validate required fields
    if (!userName || !item || !contact || !reviewText || !profileId) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    try {
      // Check if a review already exists for this profileId
      const existingReview = await prisma.reviews.findUnique({
        where: { profileId },
      });

      if (existingReview) {
        return res.status(400).json({ error: 'A review already exists for this profileId' });
      }

      // Create the new review
      const newReview = await prisma.reviews.create({
        data: {
          userName,
          item,
          rating: rating || null, // Handle optional rating
          contact,
          reviewText,
          profileId,
        },
      });

      res.status(200).json(newReview);
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(500).json({ error: 'Unexpected error' });
}
