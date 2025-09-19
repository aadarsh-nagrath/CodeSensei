import axios from "axios";
import { Language_versions } from "./constant";
import aiService from "../lib/ai-service";
import cacheService from "../lib/cache-service";
import { PerformanceService } from "../lib/monitoring";

// Ensure environment variables are loaded
if (typeof window === 'undefined') {
  require('dotenv').config();
}

interface EnhancedGenerateContentResponse {
  qname: string;
  description: string;
  constraints: string[];
  example_test_cases: Array<{
    input: any;
    output: any;
  }>;
}

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

let interestArray: Array<string> = [];

const fetchTopics = async () => {
  try {
    // Check cache first (only on server side)
    if (typeof window === 'undefined') {
      const cachedTopics = await cacheService.getTopics();
      if (cachedTopics.length > 0) {
        interestArray = cachedTopics;
        return;
      }
    }

    const response = await fetch('/interests/topic');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    interestArray = await response.json();
    
    // Cache the topics for 30 minutes (only on server side)
    if (typeof window === 'undefined') {
      await cacheService.setTopics(interestArray, 1800);
    }
    console.log('Fetched topics:', interestArray);
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
};

// const interestArray = ["spiderman", "batman and joker", "suicide squad", "doraemon", "attack on titans"];

const getRandomValue = (array: Array<string>) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const generateUniqueId = () => {
  const timestamp = Date.now();
  const randomComponent = Math.floor(Math.random() * 1000000);
  return `${timestamp}${randomComponent}`;
};

// Piston API for code execution
export const executeCode = async (
  language: keyof typeof Language_versions,
  sourceCode: string
) => {
  try {
    const response = await API.post("/execute", {
      language: language,
      version: Language_versions[language],
      files: [
        {
          content: sourceCode,
        },
      ],
    });
    return response.data;
  } catch (error) {
    console.error("Error executing code:", error);
    throw error;
  }
};

function convertToJsonAndLog(text: string): EnhancedGenerateContentResponse | null {
  // Check if the text contains a JSON object
  if (!text.startsWith('{')) {
    // Extract the JSON part from the response
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);

    // Parse the JSON string to a JavaScript object
    const jsonObject = JSON.parse(jsonString);

    // Log the JavaScript object
    console.log('Parsed JSON object:', jsonObject);

    return jsonObject;
  } else {
    // If it already starts with '{', just parse and log it
    const jsonObject = JSON.parse(text);
    console.log('Parsed JSON object:', jsonObject);
    return jsonObject;
  }
}

async function newQuestion(topic: string, difficulty: string = 'medium') {
  return await PerformanceService.measureExecutionTime(
    async () => {
      const questionData = await aiService.generateQuestion(topic, difficulty);
      return questionData;
    },
    'question_generation',
    { topic, difficulty }
  );
}


// Fun, engaging fallback questions in case AI generation fails
const fallbackQuestions = [
  {
    qname: "Superhero Power Ranking",
    description: "In the superhero universe, different heroes have unique power levels. You need to create a ranking system that can efficiently find the top K most powerful heroes and handle dynamic updates when power levels change. Given an array of power levels and a value K, find the Kth largest power level. This is a classic heap problem!",
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
    qname: "Pokemon Battle Strategy",
    description: "You're a Pokemon trainer preparing for a tournament. You have N Pokemon with different strengths, and you need to arrange them in a line such that the sum of strengths of adjacent Pokemon is maximized. This is a dynamic programming problem where you need to find the maximum sum of non-adjacent elements.",
    constraints: [
      "1 <= pokemon.length <= 10^4",
      "1 <= pokemon[i] <= 10^6"
    ],
    example_test_cases: [
      { input: { pokemon: [2, 7, 9, 3, 1] }, output: 12 },
      { input: { pokemon: [1, 2, 3, 1] }, output: 4 }
    ]
  },
  {
    qname: "Adventure Quest Path",
    description: "You're on an adventure quest and need to find the shortest path between two locations. Given a graph where each node represents a location and edges represent connections with travel costs, find the minimum cost to travel from the starting location to the destination. This is a classic shortest path problem using Dijkstra's algorithm.",
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

// API for next Question
export const getNextQuestion = async () => {
  return await PerformanceService.measureExecutionTime(
    async () => {
      const qid = generateUniqueId();
      
      // Check if question already exists in cache (only on server side)
      if (typeof window === 'undefined') {
        const cachedQuestion = await cacheService.getQuestion(qid);
        if (cachedQuestion) {
          return { qid, questionData: cachedQuestion };
        }
      }

      await fetchTopics();
      if(interestArray.length === 0) {
        interestArray = ["spiderman", "batman and joker", "suicide squad", "doraemon", "attack on titans"];
      }
      
      const interest = getRandomValue(interestArray);
      const difficulties = ['easy', 'medium', 'hard'];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      
      console.log(`Attempting to generate question for topic: ${interest}, difficulty: ${difficulty}`);
      
      let questionData = await newQuestion(interest, difficulty);

      // If AI generation fails, use fallback question
      if (!questionData) {
        console.log("AI generation failed, using fallback question");
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
          
          return { qid, questionData };
        } catch (error) {
          console.error("Error saving question data:", error);
          // Even if saving fails, return the question data
          return { qid, questionData };
        }
      }
      
      throw new Error("Failed to generate question and no fallback available");
    },
    'get_next_question'
  );
};