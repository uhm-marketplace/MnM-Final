import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userName, item, rating, contact, reviewText } = req.body;

    try {
      const newReview = await prisma.reviews.create({
        data: {
          userName,
          item,
          rating,
          contact,
          reviewText,
          profileId: req.body.profileId,
        },
      });
      res.status(200).json(newReview);
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
