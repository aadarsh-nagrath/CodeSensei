"use server";
import clientPromise from '../../../lib/db';

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db();
  
  try {
    const { interest } = await req.json();
    console.log('Received interest:', interest); // Log incoming interest

    if (!interest) {
      console.error('No interest provided');
      return new Response(JSON.stringify({ message: 'No interest provided' }), { status: 400 });
    }

    const existingInterest = await db.collection('interests').findOne({ topic: interest });
    console.log('Existing interest:', existingInterest); // Log existing interest

    if (!existingInterest) {
      await db.collection('interests').insertOne({ topic: interest, freq: 1 });
      return new Response(JSON.stringify({ message: 'Topic added successfully' }), { status: 201 });
    }

    await db.collection('interests').updateOne({ topic: interest }, { $inc: { freq: 1 } });
    return new Response(JSON.stringify({ message: 'Frequency updated successfully' }), { status: 200 });
    
  } catch (error) {
    console.error('Caught error:', error); // Log full error details
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function GET(req: Request) {
  const client = await clientPromise;
  const db = client.db();
  try {
    const interests = await db.collection('interests').find().toArray();
    // Map the interests array to extract only the 'topic' fields
    const topicsArray = interests.map(interest => interest.topic);
    console.log('Topics array:', topicsArray);
    return new Response(JSON.stringify(topicsArray), { status: 200 });
  } catch (error) {
    console.error('Caught error:', error); // Log full error details
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
