/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Incoming Payload:', data);

    const { projectId, userId, bidAmount, ownerId } = data;

    if (!projectId || !userId || !bidAmount || !ownerId) {
      console.error('Validation Failed: Missing fields', { projectId, userId, bidAmount, ownerId });
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    // Process the data...
  } catch (error) {
    console.error('API Error:', (error as Error).message);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}
