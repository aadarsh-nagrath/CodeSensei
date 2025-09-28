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
        
        const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `Create an engaging DSA coding problem that incorporates "${topic}" as a central theme. Make it FUN and relatable!

        The problem should:
        - Have a creative storyline involving ${topic}
        - Be a real DSA problem (arrays, strings, trees, graphs, etc.) disguised in an engaging scenario
        - Make learning DSA enjoyable through ${topic} context
        - Include specific ${topic} elements in the problem description
        - Be challenging but solvable

        Examples of good themes:
        - If topic is "Thor": "Thor's Hammer Distribution", "Asgardian Army Formation", "Mjolnir Power Levels"
        - If topic is "Pokemon": "Pokemon Battle Strategy", "Gym Leader Challenge", "Pokemon Evolution Tree"
        - If topic is "Marvel": "Avengers Team Formation", "Infinity Stone Collection", "Superhero Power Rankings"

        Return ONLY valid JSON in this exact format:
        {
          "qname": "Creative title involving ${topic}",
          "description": "Engaging story with ${topic} + clear DSA problem statement",
          "constraints": ["constraint1", "constraint2", "constraint3"],
          "example_test_cases": [
            {"input": {"param1": value1, "param2": value2}, "output": expected_output},
            {"input": {"param1": value3, "param2": value4}, "output": expected_output2}
          ]
        }

        Make it creative, fun, and educational!`;

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

const aiService = new AIService();
export default aiService;
