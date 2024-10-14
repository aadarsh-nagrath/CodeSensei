"use server";

import clientPromise from '../../../lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db();

  try {
    const { username, password } = await req.json();

    // Check if the user exists
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.collection('users').insertOne({ username, password: hashedPassword });
      return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
    }

    // Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (typeof jwtSecret !== 'string') {
      throw new Error('JWT_SECRET is not properly configured');
    }
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
