import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/db';
import { isSessionValid } from '../../../lib/session';

export async function POST(request: NextRequest) {
  try {
    const { questionId, questionData } = await request.json();

    if (!questionId || !questionData) {
      return NextResponse.json(
        { error: 'Question ID and data are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // For now, use a default user ID. In production, this should come from JWT token
    const userId = 'default_user';

    // Check if question already exists
    const existingQuestion = await db.collection('saved_questions').findOne({
      userId,
      questionId,
    });

    if (existingQuestion) {
      return NextResponse.json({ 
        success: true, 
        message: 'Question already saved' 
      });
    }

    // Save question to user's saved questions
    const result = await db.collection('saved_questions').insertOne({
      userId,
      questionId,
      questionData,
      savedAt: new Date(),
    });

    console.log(`Question ${questionId} saved for user ${userId} with ID: ${result.insertedId}`);
    return NextResponse.json({ success: true });

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
    const client = await clientPromise;
    const db = client.db();

    // For now, use a default user ID. In production, this should come from JWT token
    const userId = 'default_user';

    // Get all saved questions for the user
    const savedQuestions = await db.collection('saved_questions')
      .find({ userId })
      .sort({ savedAt: -1 })
      .toArray();

    return NextResponse.json({ savedQuestions });

  } catch (error) {
    console.error('Error fetching saved questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved questions' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { questionId } = await request.json();

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

    // Remove question from user's saved questions
    const result = await db.collection('saved_questions').deleteOne({
      userId,
      questionId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Question not found in saved questions' },
        { status: 404 }
      );
    }

    console.log(`Question ${questionId} removed from user ${userId} saved questions`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error removing saved question:', error);
    return NextResponse.json(
      { error: 'Failed to remove saved question' },
      { status: 500 }
    );
  }
}
