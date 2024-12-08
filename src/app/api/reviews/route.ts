import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('POST request received:', req.body);

    const { userName, item, rating, contact, reviewText, profileId } = req.body;

    if (!userName || !item || !contact || !reviewText || !profileId) {
      console.error('Validation failed:', { userName, item, contact, reviewText, profileId });
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    try {
      console.log('Creating new review...');
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
      return res.status(200).json(newReview);
    } catch (error: any) {
      console.error('Error during review submission:', error.message, error.stack);
      return res.status(500).json({ error: 'Failed to submit review' });
    }
  } else {
    console.warn('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
