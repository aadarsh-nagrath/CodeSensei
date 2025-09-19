export class MonitoringService {
  static trackQuestionGeneration(duration: number, topic: string, difficulty: string) {
    console.log(`Question generated for topic: ${topic}, difficulty: ${difficulty}, duration: ${duration}ms`);
    // In production, you would send this to a monitoring service like DataDog, New Relic, etc.
  }

  static trackUserAction(userId: string, action: string, metadata?: any) {
    console.log(`User ${userId} performed ${action}`, metadata);
    // Track user engagement metrics
  }

  static trackError(error: Error, context: string, metadata?: any) {
    console.error(`Error in ${context}:`, error, metadata);
    // Send to error tracking service like Sentry
  }

  static trackPerformance(operation: string, duration: number, metadata?: any) {
    console.log(`Performance: ${operation} took ${duration}ms`, metadata);
    // Track performance metrics
  }
}

export class PerformanceService {
  static async measureExecutionTime<T>(
    fn: () => Promise<T>,
    operation: string,
    metadata?: any
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      MonitoringService.trackPerformance(operation, duration, metadata);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      MonitoringService.trackError(error as Error, operation, { ...metadata, duration });
      throw error;
    }
  }
}
