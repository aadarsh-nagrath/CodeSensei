import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/db';
import { isSessionValid } from '../../../lib/session';

export async function POST(request: NextRequest) {
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

    // Check if question is already marked as solved
    const existingSolved = await db.collection('solved_questions').findOne({
      userId,
      questionId,
    });

    if (existingSolved) {
      return NextResponse.json({ 
        success: true, 
        message: 'Question already marked as solved',
        alreadySolved: true
      });
    }

    // Add question to solved questions collection
    await db.collection('solved_questions').insertOne({
      userId,
      questionId,
      solvedAt: new Date(),
    });

    // Update user's solved questions count
    const user = await db.collection('users').findOne({ username: userId });
    
    if (user) {
      // Update existing user's solved questions count
      await db.collection('users').updateOne(
        { username: userId },
        { 
          $inc: { 'progress.solvedQuestions': 1 },
          $set: { 'progress.lastActive': new Date() }
        }
      );
    } else {
      // Create new user with initial progress
      await db.collection('users').insertOne({
        username: userId,
        progress: {
          totalQuestions: 0,
          solvedQuestions: 1,
          streak: 1,
          lastActive: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log(`Question ${questionId} marked as solved for user ${userId}`);
    return NextResponse.json({ 
      success: true, 
      message: 'Question marked as solved successfully',
      alreadySolved: false
    });

  } catch (error) {
    console.error('Error marking question as solved:', error);
    return NextResponse.json(
      { error: 'Failed to mark question as solved' },
      { status: 500 }
    );
  }
}

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

    // Check if question is marked as solved
    const solvedQuestion = await db.collection('solved_questions').findOne({
      userId,
      questionId,
    });

    return NextResponse.json({ 
      isSolved: !!solvedQuestion,
      solvedAt: solvedQuestion?.solvedAt || null
    });

  } catch (error) {
    console.error('Error checking solved status:', error);
    return NextResponse.json(
      { error: 'Failed to check solved status' },
      { status: 500 }
    );
  }
}
