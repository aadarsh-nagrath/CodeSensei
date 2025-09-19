import { NextRequest, NextResponse } from 'next/server';
import cacheService from './cache-service';

export async function rateLimitMiddleware(
  request: NextRequest,
  limit: number = 100,
  windowMs: number = 900 // 15 minutes
) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  const isAllowed = await cacheService.checkRateLimit(ip, limit, windowMs);
  
  if (!isAllowed) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { status: 429 }
    );
  }
  
  return null; // Allow request to continue
}
