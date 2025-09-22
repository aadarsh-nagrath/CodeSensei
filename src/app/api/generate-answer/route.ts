import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { questionId, language, forceRegenerate = false } = await request.json();

    if (!questionId || !language) {
      return NextResponse.json(
        { error: 'Question ID and language are required' },
        { status: 400 }
      );
    }

    // Get question details from database
    const client = await clientPromise;
    const db = client.db();
    
    const question = await db.collection('questions').findOne({ qid: questionId });
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if solution already exists for this question and language (unless force regenerate)
    const userId = 'default_user'; // In a real app, this would be the actual user ID
    const existingSolution = await db.collection('generated_answers').findOne({
      questionId,
      language,
      userId
    });

    if (existingSolution && !forceRegenerate) {
      console.log('Returning cached solution for question:', questionId, 'language:', language);
      return NextResponse.json({
        success: true,
        answer: existingSolution.answer,
        cached: true
      });
    }

    if (forceRegenerate && existingSolution) {
      console.log('Force regenerating solution for question:', questionId, 'language:', language);
      // Delete the existing solution to regenerate
      await db.collection('generated_answers').deleteOne({
        questionId,
        language,
        userId
      });
    }

    // Prepare the prompt for AI
    const prompt = `You are an expert programming tutor. Please provide a complete solution for the following coding problem in ${language}.

**Problem:**
${question.qname}

**Description:**
${question.description}

**Constraints:**
${question.constraints || 'None specified'}

**Example Test Cases:**
${question.example_test_cases?.map((example: any, index: number) => 
  `Example ${index + 1}:
Input: ${JSON.stringify(example.input)}
Output: ${JSON.stringify(example.output)}
Explanation: ${example.explanation || 'N/A'}`
).join('\n\n') || 'No examples provided'}

**Requirements:**
1. Provide a complete, working solution in ${language}
2. Include detailed time and space complexity analysis
3. Explain the approach and algorithm used
4. Add comments to explain key parts of the code
5. Handle edge cases appropriately
6. Make the code clean and readable

**Response Format:**
Please structure your response as follows:

**Approach:**
[Explain the algorithm and approach]

**Solution:**
\`\`\`${language}
[Your complete code solution here]
\`\`\`

**Time Complexity:** O([complexity])
**Space Complexity:** O([complexity])

**Explanation:**
[Detailed explanation of how the solution works]

**Edge Cases:**
[Discuss edge cases and how they're handled]

**Alternative Approaches:**
[If applicable, mention other possible solutions]`;

    // Check if Gemini API key is available
    if (!process.env.NEXT_PUBLIC_GENAI_API_KEY) {
      console.error('Gemini API key not configured, using fallback solution');
      // Return a fallback solution when AI is not available
      const fallbackAnswer = generateFallbackSolution(question, language);
      return NextResponse.json({
        success: true,
        answer: fallbackAnswer,
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GENAI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Call Gemini AI to generate the answer
    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      throw new Error("Invalid response from Gemini");
    }

    const response = result.response;
    const aiAnswer = await response.text();

    if (!aiAnswer) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    // Parse the AI response to extract structured data
    const parsedAnswer = parseAIResponse(aiAnswer, language);

    // Store the generated answer in database for future reference
    await db.collection('generated_answers').insertOne({
      questionId,
      language,
      answer: parsedAnswer,
      generatedAt: new Date(),
      userId: 'default_user', // In a real app, this would be the actual user ID
      isRegenerated: forceRegenerate,
    });

    return NextResponse.json({
      success: true,
      answer: parsedAnswer,
    });

  } catch (error) {
    console.error('Error generating answer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function parseAIResponse(response: string, language: string) {
  // Extract different sections from the AI response
  const approachMatch = response.match(/\*\*Approach:\*\*\s*([\s\S]*?)(?=\*\*Solution:\*\*|\*\*Time Complexity:\*\*|$)/i);
  const solutionMatch = response.match(/```(?:javascript|python|java|cpp|c\+\+|c|typescript|go|rust|php|ruby|swift|kotlin|scala|r|sql|bash|shell)?\s*([\s\S]*?)```/i);
  const timeComplexityMatch = response.match(/\*\*Time Complexity:\*\*\s*([^\n]+)/i);
  const spaceComplexityMatch = response.match(/\*\*Space Complexity:\*\*\s*([^\n]+)/i);
  const explanationMatch = response.match(/\*\*Explanation:\*\*\s*([\s\S]*?)(?=\*\*Edge Cases:\*\*|\*\*Alternative Approaches:\*\*|$)/i);
  const edgeCasesMatch = response.match(/\*\*Edge Cases:\*\*\s*([\s\S]*?)(?=\*\*Alternative Approaches:\*\*|$)/i);
  const alternativesMatch = response.match(/\*\*Alternative Approaches:\*\*\s*([\s\S]*?)$/i);

  return {
    approach: approachMatch ? approachMatch[1].trim() : '',
    solution: solutionMatch ? solutionMatch[1].trim() : '',
    timeComplexity: timeComplexityMatch ? timeComplexityMatch[1].trim() : 'Not specified',
    spaceComplexity: spaceComplexityMatch ? spaceComplexityMatch[1].trim() : 'Not specified',
    explanation: explanationMatch ? explanationMatch[1].trim() : '',
    edgeCases: edgeCasesMatch ? edgeCasesMatch[1].trim() : '',
    alternativeApproaches: alternativesMatch ? alternativesMatch[1].trim() : '',
    rawResponse: response,
  };
}

function generateFallbackSolution(question: any, language: string) {
  // Generate a basic fallback solution when AI is not available
  const basicSolution = getBasicSolutionTemplate(language);
  
  return {
    approach: "This is a basic solution template. For a detailed AI-generated solution, please ensure the Gemini API key is configured.",
    solution: basicSolution,
    timeComplexity: "O(n) - depends on the specific problem",
    spaceComplexity: "O(1) - depends on the specific problem", 
    explanation: "This is a placeholder solution. The AI service is currently not available. Please contact the administrator to configure the Gemini API key for detailed solutions.",
    edgeCases: "Consider edge cases like empty inputs, single elements, and boundary conditions.",
    alternativeApproaches: "Different approaches may include iterative vs recursive solutions, or using different data structures.",
    rawResponse: "Fallback solution generated due to AI service unavailability",
  };
}

function getBasicSolutionTemplate(language: string): string {
  const templates: { [key: string]: string } = {
    javascript: `function solve(input) {
    // Your solution here
    // Consider the problem constraints and examples
    
    return result;
}`,
    python: `def solve(input):
    # Your solution here
    # Consider the problem constraints and examples
    
    return result`,
    java: `public class Solution {
    public static int solve(int[] input) {
        // Your solution here
        // Consider the problem constraints and examples
        
        return result;
    }
}`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

int solve(vector<int>& input) {
    // Your solution here
    // Consider the problem constraints and examples
    
    return result;
}`,
  };
  
  return templates[language.toLowerCase()] || templates.javascript;
}
