import { NextRequest, NextResponse } from 'next/server';
import aiService from '@/lib/ai-service';
import cacheService from '@/lib/cache-service';
import { PerformanceService } from '@/lib/monitoring';
import axios from 'axios';

// Generate a unique ID for questions
const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty = 'medium' } = await request.json();

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const trimmedTopic = topic.trim();
    console.log(`Generating question for topic: ${trimmedTopic}, difficulty: ${difficulty}`);

    return await PerformanceService.measureExecutionTime(
      async () => {
        const qid = generateUniqueId();
        
        // Check if question already exists in cache (only on server side)
        if (typeof window === 'undefined') {
          const cachedQuestion = await cacheService.getQuestion(qid);
          if (cachedQuestion) {
            return NextResponse.json({ qid, questionData: cachedQuestion });
          }
        }

        // Generate question with the specific topic
        let questionData = await aiService.generateQuestion(trimmedTopic, difficulty);

        if (!questionData) {
          // Fun, engaging fallback questions for specific topics
          const fallbackQuestions = [
            {
              qname: `${trimmedTopic} Power Ranking System`,
              description: `In the world of ${trimmedTopic}, different characters have unique power levels. You need to create a ranking system that can efficiently find the top K most powerful characters and handle dynamic updates when power levels change. Given an array of power levels and a value K, find the Kth largest power level. This is a classic heap problem disguised in ${trimmedTopic} theme!`,
              constraints: [
                "1 <= power_levels.length <= 10^5",
                "1 <= K <= power_levels.length",
                "1 <= power_levels[i] <= 10^9"
              ],
              example_test_cases: [
                { input: { power_levels: [10, 5, 15, 20, 8], k: 3 }, output: 10 },
                { input: { power_levels: [100, 50, 75, 25], k: 2 }, output: 75 }
              ]
            },
            {
              qname: `${trimmedTopic} Battle Formation`,
              description: `The ${trimmedTopic} army needs to form the most effective battle formation. You have N warriors with different strengths, and you need to arrange them in a line such that the sum of strengths of adjacent warriors is maximized. This is a dynamic programming problem where you need to find the maximum sum of non-adjacent elements.`,
              constraints: [
                "1 <= warriors.length <= 10^4",
                "1 <= warriors[i] <= 10^6"
              ],
              example_test_cases: [
                { input: { warriors: [2, 7, 9, 3, 1] }, output: 12 },
                { input: { warriors: [1, 2, 3, 1] }, output: 4 }
              ]
            },
            {
              qname: `${trimmedTopic} Quest Path Optimization`,
              description: `You're on a quest in the ${trimmedTopic} universe and need to find the shortest path between two locations. Given a graph where each node represents a location and edges represent connections with travel costs, find the minimum cost to travel from the starting location to the destination. This is a classic shortest path problem using Dijkstra's algorithm.`,
              constraints: [
                "1 <= n <= 1000",
                "0 <= edges.length <= 10^4",
                "1 <= cost <= 1000"
              ],
              example_test_cases: [
                { input: { n: 4, edges: [[0,1,1],[1,2,3],[2,3,1],[0,3,4]], start: 0, end: 3 }, output: 4 },
                { input: { n: 3, edges: [[0,1,2],[1,2,1],[0,2,4]], start: 0, end: 2 }, output: 3 }
              ]
            }
          ];

          const randomFallback = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
          questionData = randomFallback;
        }

        if (questionData) {
          // Cache the question for 1 hour (only on server side)
          if (typeof window === 'undefined') {
            await cacheService.setQuestion(qid, questionData, 3600);
          }
          
          // Save the question to database
          try {
            const saveRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/question`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ qid, questionData }),
            });

            if (saveRes.ok) {
              console.log("Successfully saved question:", questionData.qname);
            } else {
              console.error("Failed to save question to database");
            }
            
            return NextResponse.json({ qid, questionData });
          } catch (error) {
            console.error("Error saving question data:", error);
            // Even if saving fails, return the question data
            return NextResponse.json({ qid, questionData });
          }
        }
        
        throw new Error("Failed to generate question and no fallback available");
      },
      'generate_question_with_topic',
      { topic: trimmedTopic, difficulty }
    );

  } catch (error) {
    console.error('Error in generate-question API:', error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
