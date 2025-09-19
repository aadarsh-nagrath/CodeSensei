import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { qid, questionData } = await request.json();

    if (!qid || !questionData) {
      return NextResponse.json(
        { error: 'Question ID and data are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Save question to database
    await db.collection('questions').insertOne({
      qid,
      ...questionData,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    });

    console.log(`Question ${qid} saved to database:`, questionData.qname);
    return NextResponse.json({ success: true, qid });

  } catch (error) {
    console.error('Error saving question:', error);
    return NextResponse.json(
      { error: 'Failed to save question' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qid = searchParams.get('qid');

    if (!qid) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const question = await db.collection('questions').findOne({ qid });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Remove internal fields
    const { _id, createdAt, expiresAt, ...questionData } = question;
    return NextResponse.json(questionData);

  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}
