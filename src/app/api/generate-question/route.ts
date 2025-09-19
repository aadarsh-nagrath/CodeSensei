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
          // Fallback questions for specific topics
          const fallbackQuestions = [
            {
              qname: `${trimmedTopic} Array Challenge`,
              description: `Given an array related to ${trimmedTopic}, implement a function that processes the data efficiently. The function should handle edge cases and optimize for performance.`,
              constraints: [
                "1 <= array.length <= 10^4",
                "-10^9 <= array[i] <= 10^9"
              ],
              example_test_cases: [
                { input: { array: [1, 2, 3, 4, 5] }, output: 15 },
                { input: { array: [10, 20, 30] }, output: 60 }
              ]
            },
            {
              qname: `${trimmedTopic} String Manipulation`,
              description: `Working with ${trimmedTopic} themed strings, create a function that transforms the input according to the given requirements. Consider all possible edge cases.`,
              constraints: [
                "1 <= string.length <= 1000",
                "string contains only lowercase letters"
              ],
              example_test_cases: [
                { input: { str: "hello" }, output: "olleh" },
                { input: { str: "world" }, output: "dlrow" }
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
          
          // POST the generated question data to `/question/${qid}`
          try {
            await axios.post(`/question/${qid}`, questionData);
            console.log("Successfully posted question:", questionData.qname);
            return NextResponse.json({ qid, questionData });
          } catch (error) {
            console.error("Error posting question data:", error);
            // Even if posting fails, return the question data
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
