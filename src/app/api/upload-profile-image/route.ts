import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, generateFileName } from '../../../lib/gcs';
import clientPromise from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // For now, use a default user ID. In production, this should come from JWT token
    const userId = 'default_user';

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const fileName = generateFileName(userId, file.name);
    
    // Upload to GCS
    const imageUrl = await uploadFile(buffer, fileName, file.type);

    // Update user profile in database
    const client = await clientPromise;
    const db = client.db();

    // Update user's profile image URL
    const result = await db.collection('users').updateOne(
      { username: userId },
      { 
        $set: { 
          'profile.imageUrl': imageUrl,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      // If user doesn't exist, create a new user with profile image
      await db.collection('users').updateOne(
        { username: userId },
        {
          $setOnInsert: {
            username: userId,
            email: `${userId}@codesensei.local`,
            profile: {
              level: 'beginner',
              interests: [],
              preferredLanguages: ['javascript', 'python'],
              timezone: 'UTC',
              imageUrl: imageUrl
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
          },
          $set: {
            'profile.imageUrl': imageUrl,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      message: 'Profile image uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading profile image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to upload profile image',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // For now, use a default user ID. In production, this should come from JWT token
    const userId = 'default_user';

    const client = await clientPromise;
    const db = client.db();

    // Get current user to find the image URL
    const user = await db.collection('users').findOne({ username: userId });
    
    if (!user || !user.profile?.imageUrl) {
      return NextResponse.json(
        { error: 'No profile image found' },
        { status: 404 }
      );
    }

    // Extract filename from URL for deletion
    const imageUrl = user.profile.imageUrl;
    const fileName = imageUrl.split('/').slice(-2).join('/'); // Get the path part

    // Delete from GCS (optional - you might want to keep images for backup)
    // await deleteFile(fileName);

    // Remove image URL from user profile
    await db.collection('users').updateOne(
      { username: userId },
      { 
        $unset: { 'profile.imageUrl': '' },
        $set: { updatedAt: new Date() }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile image removed successfully'
    });

  } catch (error) {
    console.error('Error removing profile image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to remove profile image',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
