import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // For now, use a default user ID. In production, this should come from JWT token
    const userId = 'default_user';

    // Check if question is saved for the user
    const savedQuestion = await db.collection('saved_questions').findOne({
      userId,
      questionId,
    });

    return NextResponse.json({ 
      isBookmarked: !!savedQuestion 
    });

  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return NextResponse.json(
      { error: 'Failed to check bookmark status' },
      { status: 500 }
    );
  }
}
