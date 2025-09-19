import { GoogleGenerativeAI } from '@google/generative-ai';

interface QuestionData {
  qname: string;
  description: string;
  constraints: string[];
  example_test_cases: Array<{
    input: any;
    output: any;
  }>;
}

class AIService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GENAI_API_KEY || ""
    );
  }

  async generateQuestion(topic: string, difficulty: string = 'medium'): Promise<QuestionData | null> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Generating question attempt ${attempt}/${maxRetries} for topic: ${topic}, difficulty: ${difficulty}`);
        
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Generate a ${difficulty} DSA question about ${topic}. 
        Return JSON format: {qname, description, constraints, example_test_cases}
        Make it innovative and never created before, similar to LeetCode style.
        Include 2 example test cases with proper input/output format.
        Ensure the JSON is valid and complete.`;

        const result = await model.generateContent(prompt);
        
        if (!result || !result.response) {
          throw new Error("Invalid response from Gemini");
        }

        const response = result.response;
        const text = await response.text();

        console.log("Raw AI response:", text);

        // Parse JSON response
        const jsonData = this.extractJsonFromText(text);
        const questionData = JSON.parse(jsonData);

        // Validate the question data
        if (!questionData.qname || !questionData.description) {
          throw new Error("Invalid question data structure");
        }

        console.log("Successfully generated question:", questionData);
        return questionData;

      } catch (error) {
        lastError = error as Error;
        console.error(`Error generating question (attempt ${attempt}/${maxRetries}):`, error);
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error("Failed to generate question after all retries:", lastError);
    return null;
  }

  private extractJsonFromText(text: string): string {
    // Check if the text contains a JSON object
    if (!text.startsWith('{')) {
      // Extract the JSON part from the response
      const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      return jsonString;
    }
    return text;
  }
}

export default new AIService();
