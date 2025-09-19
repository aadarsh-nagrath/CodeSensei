class CacheService {
  private redis: any = null;

  constructor() {
    // Only initialize Redis on server side
    if (typeof window === 'undefined' && process.env.REDIS_URL) {
      try {
        const Redis = require('ioredis');
        this.redis = new Redis(process.env.REDIS_URL);
      } catch (error) {
        console.warn('Redis not available:', error);
      }
    }
  }

  // Question caching
  async getQuestion(qid: string): Promise<any> {
    if (!this.redis) return null;
    
    try {
      const cached = await this.redis.get(`question:${qid}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async setQuestion(qid: string, question: any, ttl: number = 3600): Promise<void> {
    if (!this.redis) return;
    
    try {
      await this.redis.setex(`question:${qid}`, ttl, JSON.stringify(question));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  // User session caching
  async getSession(sessionId: string): Promise<any> {
    if (!this.redis) return null;
    
    try {
      const cached = await this.redis.get(`session:${sessionId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Redis get session error:', error);
      return null;
    }
  }

  async setSession(sessionId: string, session: any, ttl: number = 86400): Promise<void> {
    if (!this.redis) return;
    
    try {
      await this.redis.setex(`session:${sessionId}`, ttl, JSON.stringify(session));
    } catch (error) {
      console.error('Redis set session error:', error);
    }
  }

  // Rate limiting
  async checkRateLimit(ip: string, limit: number = 100, window: number = 900): Promise<boolean> {
    if (!this.redis) return true; // Allow if Redis is not available
    
    try {
      const key = `rate_limit:${ip}`;
      const current = await this.redis.incr(key);
      
      if (current === 1) {
        await this.redis.expire(key, window);
      }
      
      return current <= limit;
    } catch (error) {
      console.error('Redis rate limit error:', error);
      return true; // Allow if error
    }
  }

  // Cache topics/interests
  async getTopics(): Promise<string[]> {
    if (!this.redis) return [];
    
    try {
      const cached = await this.redis.get('topics');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Redis get topics error:', error);
      return [];
    }
  }

  async setTopics(topics: string[], ttl: number = 1800): Promise<void> {
    if (!this.redis) return;
    
    try {
      await this.redis.setex('topics', ttl, JSON.stringify(topics));
    } catch (error) {
      console.error('Redis set topics error:', error);
    }
  }

  // Clear cache
  async clearCache(pattern: string): Promise<void> {
    if (!this.redis) return;
    
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Redis clear cache error:', error);
    }
  }
}

export default new CacheService();
