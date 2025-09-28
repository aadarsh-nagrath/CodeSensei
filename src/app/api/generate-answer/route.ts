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

    // Prepare the prompt for AI (explicitly enforce EASY-level, accuracy, and validation against provided examples)
    const prompt = `You are an expert programming tutor. Provide an EASY-level (simple and correct) solution for the following coding problem in ${language}. Prioritize clarity and correctness over cleverness.

**Problem:**
${question.qname}

**Description:**
${question.description}

**Constraints:**
${question.constraints || 'None specified'}

**Example Test Cases (GROUND TRUTH - DO NOT CHANGE):**
${question.example_test_cases?.map((example: any, index: number) => 
  `Example ${index + 1}:
Input: ${JSON.stringify(example.input)}
Output: ${JSON.stringify(example.output)}
Explanation: ${example.explanation || 'N/A'}`
).join('\n\n') || 'No examples provided'}

**Requirements:**
1. Provide a complete, working solution in ${language}, EASY-level and straightforward.
2. STRICT: Treat the examples above as canonical ground truth. Do NOT invent, modify, or add test cases.
3. Your solution MUST produce EXACTLY the expected outputs for ALL provided examples.
4. Include detailed time and space complexity analysis.
5. Explain the approach briefly and list key edge cases handled.
6. Add minimal, helpful code comments.
7. Make the code clean, readable, and runnable as-is.
8. If any ambiguity exists, state assumptions clearly and align them with the examples.

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
[If applicable, mention other possible solutions]

NOTE:
- Do not alter the examples. Ensure your solution, when executed against the examples, yields the exact expected outputs.
- Prefer simple constructs and the most understandable algorithm that passes the examples.`;

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    
    // Enhance the solution with executable wrapper
    parsedAnswer.executableSolution = createExecutableSolution(parsedAnswer.solution, language, question);

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
    executableSolution: '', // Will be set later
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
    executableSolution: '', // Will be set later
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

function createExecutableSolution(solution: string, language: string, question: any): string {
  const examples = question.example_test_cases || [];
  
  switch (language.toLowerCase()) {
    case 'java':
      return createJavaExecutable(solution, examples);
    case 'javascript':
      return createJavaScriptExecutable(solution, examples);
    case 'python':
      return createPythonExecutable(solution, examples);
    case 'cpp':
      return createCppExecutable(solution, examples);
    default:
      return solution;
  }
}

function createJavaExecutable(solution: string, examples: any[]): string {
  // Extract the class name and method from the solution
  const classMatch = solution.match(/class\s+(\w+)/);
  const staticMethodMatch = solution.match(/public\s+static\s+([\w<>\[\]]+)\s+(\w+)\s*\(([^)]*)\)/);
  const instanceMethodMatch = solution.match(/public\s+([\w<>\[\]]+)\s+(\w+)\s*\(([^)]*)\)/);
  
  if (!classMatch || (!staticMethodMatch && !instanceMethodMatch)) {
    return solution; // Return original if we can't parse it
  }
  
  const className = classMatch[1];
  const isStatic = Boolean(staticMethodMatch);
  const returnType = (staticMethodMatch || instanceMethodMatch)![1];
  const methodName = (staticMethodMatch || instanceMethodMatch)![2];
  const paramList = (staticMethodMatch || instanceMethodMatch)![3];
  const paramTypes = paramList
    .split(',')
    .map(s => s.trim().split(' ')[0])
    .filter(Boolean);
  
  let testCases = '';
  examples.forEach((example, index) => {
    if (example.input && example.output !== undefined) {
      const args: any[] = Array.isArray(example.input) ? example.input : [example.input];
      const argLiterals = args.map((arg: any, i: number) => toJavaLiteral(arg, paramTypes[i] || 'Object'));
      const expectedLiteral = toJavaLiteral(example.output, returnType);
      const callExpr = isStatic ? `${className}.${methodName}(${argLiterals.join(', ')})` : `solution.${methodName}(${argLiterals.join(', ')})`;
      const resultVar = `result${index + 1}`;
      testCases += `
        // Test case ${index + 1}
        System.out.println("Test case ${index + 1}:");
        ${returnType} ${resultVar} = ${callExpr};
        System.out.println("Output: " + ${toJavaPrint(returnType, resultVar)});
        System.out.println("Expected: " + ${toJavaPrint(returnType, expectedLiteral)});
        System.out.println("---");`;
    }
  });
  
  return `${solution}

public static void main(String[] args) {
    ${className} solution = new ${className}();
    
    ${testCases}
    
    // Additional test cases
    System.out.println("All test cases completed!");
}`;
}

function createJavaScriptExecutable(solution: string, examples: any[]): string {
  let testCases = '';
  examples.forEach((example, index) => {
    if (example.input && example.output !== undefined) {
      const inputStr = toJSLiteral(example.input);
      const expectedStr = toJSLiteral(example.output);
      testCases += `
// Test case ${index + 1}
console.log("Test case ${index + 1}:");
const __out${index} = solve(${inputStr});
console.log("Output:", __out${index});
console.log("Expected:", ${expectedStr});
console.log("---");`;
    }
  });
  
  return `${solution}

// Test cases
${testCases}

console.log("All test cases completed!");`;
}

function createPythonExecutable(solution: string, examples: any[]): string {
  let testCases = '';
  examples.forEach((example, index) => {
    if (example.input && example.output !== undefined) {
      const inputStr = toPythonLiteral(example.input);
      const expectedStr = toPythonLiteral(example.output);
      testCases += `
# Test case ${index + 1}
print("Test case ${index + 1}:")
__out${index} = solve(${inputStr})
print("Output:", __out${index})
print("Expected:", ${expectedStr})
print("---")`;
    }
  });
  
  return `${solution}

# Test cases
${testCases}

print("All test cases completed!")`;
}

function createCppExecutable(solution: string, examples: any[]): string {
  let testCases = '';
  examples.forEach((example, index) => {
    if (example.input && example.output !== undefined) {
      const inputStr = toCppLiteral(example.input);
      const expectedStr = toCppLiteral(example.output);
      testCases += `
    // Test case ${index + 1}
    cout << "Test case ${index + 1}:" << endl;
    auto __out${index} = solve(${inputStr});
    cout << "Output: " << ${toCppPrint(`__out${index}`)} << endl;
    cout << "Expected: " << ${toCppPrint(expectedStr)} << endl;
    cout << "---" << endl;`;
    }
  });
  
  return `${solution}

int main() {
    ${testCases}
    
    cout << "All test cases completed!" << endl;
    return 0;
}`;
}

// -------- Helpers to build language literals and prints --------
function toJSLiteral(value: any): string {
  return JSON.stringify(value);
}

function toPythonLiteral(value: any): string {
  return JSON.stringify(value)
    .replace(/true/g, 'True')
    .replace(/false/g, 'False')
    .replace(/null/g, 'None');
}

function toJavaLiteral(value: any, hintedType: string): string {
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'string') return `"${value.replace(/"/g, '\\"')}"`;
  if (Array.isArray(value)) {
    // Determine if 1D or 2D numeric arrays for simplicity
    if (Array.isArray(value[0])) {
      // 2D int array
      const rows = value.map((row: any[]) => `{${row.map((x) => toJavaLiteral(x, 'int')).join(', ')}}`).join(', ');
      return `new int[][]{${rows}}`;
    }
    // 1D array
    const elems = value.map((x) => toJavaLiteral(x, 'int')).join(', ');
    return `new int[]{${elems}}`;
  }
  // Fallback to stringified
  return `"${String(value)}"`;
}

function toJavaPrint(type: string, expr: string): string {
  // For arrays, use Arrays.deepToString / Arrays.toString
  if (type.includes('[]')) {
    if (type.includes('[][]')) return `java.util.Arrays.deepToString(${expr})`;
    return `java.util.Arrays.toString(${expr})`;
  }
  return expr;
}

function javaEquality(type: string, leftVar: string, rightExpr: string): string {
  if (type.includes('[]')) {
    if (type.includes('[][]')) return `java.util.Arrays.deepEquals(${leftVar}, ${rightExpr})`;
    return `java.util.Arrays.equals(${leftVar}, ${rightExpr})`;
  }
  return `${leftVar} == ${rightExpr}`;
}

function toCppLiteral(value: any): string {
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'string') return `std::string("${value.replace(/"/g, '\\"')}")`;
  if (Array.isArray(value)) {
    if (Array.isArray(value[0])) {
      const rows = value.map((row: any[]) => `{${row.map((x) => toCppLiteral(x)).join(', ')}}`).join(', ');
      return `std::vector<std::vector<int>>{${rows}}`;
    }
    return `std::vector<int>{${value.map((x) => toCppLiteral(x)).join(', ')}}`;
  }
  return '0';
}

function toCppPrint(expr: string): string {
  return expr; // naive; complex types will rely on default operator<< if available
}
