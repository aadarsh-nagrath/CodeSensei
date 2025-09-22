import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting user profile fetch...');
    const client = await clientPromise;
    const db = client.db();
    console.log('Database connected successfully');

    // For now, use a default user ID. In production, this should come from JWT token
    const userId = 'default_user';
    console.log('Looking for user:', userId);

    // Get user profile data
    const user = await db.collection('users').findOne({ username: userId });
    console.log('User found:', !!user);

    if (!user) {
      console.log('User not found, creating new user...');
      // If user doesn't exist, create a new user with default data
      const newUser = {
        username: userId,
        email: `${userId}@codesensei.local`, // Add email to avoid unique constraint violation
        profile: {
          level: 'beginner',
          interests: [],
          preferredLanguages: ['javascript', 'python'],
          timezone: 'UTC'
        },
        progress: {
          totalQuestions: 0,
          solvedQuestions: 0,
          streak: 0,
          lastActive: new Date()
        },
        analytics: {
          averageTimePerQuestion: 0,
          difficultyProgression: [],
          weakTopics: [],
          strongTopics: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Use upsert to avoid duplicate key errors
      const upsertResult = await db.collection('users').updateOne(
        { username: userId },
        { $setOnInsert: newUser },
        { upsert: true }
      );
      console.log('User upserted:', upsertResult.upsertedId || 'existing user found');
      
      // Fetch the user again after upsert
      const createdUser = await db.collection('users').findOne({ username: userId });
      if (createdUser) {
      return NextResponse.json({
        username: createdUser.username,
        level: createdUser.profile?.level || 'beginner',
        totalQuestions: createdUser.progress?.totalQuestions || 0,
        solvedQuestions: createdUser.progress?.solvedQuestions || 0,
        streak: createdUser.progress?.streak || 0,
        averageTime: createdUser.analytics?.averageTimePerQuestion || 0,
        weakTopics: createdUser.analytics?.weakTopics || [],
        strongTopics: createdUser.analytics?.strongTopics || [],
        joinDate: createdUser.createdAt?.toISOString() || new Date().toISOString(),
        interests: createdUser.profile?.interests || [],
        preferredLanguages: createdUser.profile?.preferredLanguages || ['javascript'],
        completionRate: 0,
        recentActivity: 0,
        lastActive: createdUser.progress?.lastActive?.toISOString() || new Date().toISOString(),
        imageUrl: createdUser.profile?.imageUrl || undefined
      });
      }
    }

    // Get solved questions count
    console.log('Counting solved questions...');
    const solvedQuestions = await db.collection('solved_questions').countDocuments({ userId });
    console.log('Solved questions count:', solvedQuestions);
    
    // Get saved questions count
    console.log('Counting saved questions...');
    const savedQuestions = await db.collection('saved_questions').countDocuments({ userId });
    console.log('Saved questions count:', savedQuestions);

    // Ensure user exists (should not be null at this point)
    if (!user) {
      throw new Error('User not found after creation');
    }

    // Calculate completion rate
    const totalQuestions = Math.max(user.progress?.totalQuestions || 0, solvedQuestions);
    const completionRate = totalQuestions > 0 ? (solvedQuestions / totalQuestions) * 100 : 0;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    console.log('Counting recent activity...');
    const recentActivity = await db.collection('solved_questions').countDocuments({
      userId,
      solvedAt: { $gte: sevenDaysAgo }
    });
    console.log('Recent activity count:', recentActivity);

    // Calculate current streak
    const streak = user.progress?.streak || 0;

    // Get topic analysis from solved questions
    console.log('Fetching solved questions data...');
    const solvedQuestionsData = await db.collection('solved_questions')
      .find({ userId })
      .sort({ solvedAt: -1 })
      .limit(50)
      .toArray();
    console.log('Solved questions data fetched:', solvedQuestionsData.length, 'items');

    // For now, we'll use default topics since we don't have topic data in questions yet
    const weakTopics = user.analytics?.weakTopics || ['Dynamic Programming', 'Graphs'];
    const strongTopics = user.analytics?.strongTopics || ['Arrays', 'Strings', 'Sorting'];
    console.log('Topics set - weak:', weakTopics, 'strong:', strongTopics);

    const responseData = {
      username: user.username,
      level: user.profile?.level || 'beginner',
      totalQuestions: totalQuestions,
      solvedQuestions: solvedQuestions,
      savedQuestions: savedQuestions,
      streak: streak,
      averageTime: user.analytics?.averageTimePerQuestion || 0,
      weakTopics: weakTopics,
      strongTopics: strongTopics,
      joinDate: user.createdAt?.toISOString() || new Date().toISOString(),
      interests: user.profile?.interests || [],
      preferredLanguages: user.profile?.preferredLanguages || ['javascript'],
      completionRate: Math.round(completionRate),
      recentActivity: recentActivity,
      lastActive: user.progress?.lastActive?.toISOString() || new Date().toISOString(),
      imageUrl: user.profile?.imageUrl || undefined
    };
    
    console.log('Returning response data:', responseData);
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error fetching user profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', errorMessage);
    console.error('Error stack:', errorStack);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user profile',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { level, interests, preferredLanguages } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    // For now, use a default user ID. In production, this should come from JWT token
    const userId = 'default_user';

    // Update user profile
    const updateData: any = {
      updatedAt: new Date()
    };

    if (level) {
      updateData['profile.level'] = level;
    }

    if (interests) {
      updateData['profile.interests'] = interests;
    }

    if (preferredLanguages) {
      updateData['profile.preferredLanguages'] = preferredLanguages;
    }

    const result = await db.collection('users').updateOne(
      { username: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
