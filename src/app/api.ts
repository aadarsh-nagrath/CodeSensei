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


// Fallback questions in case AI generation fails
const fallbackQuestions = [
  {
    qname: "Array Sum Problem",
    description: "Given an array of integers, find the sum of all elements. This is a basic array manipulation problem.",
    constraints: ["1 <= array.length <= 1000", "-1000 <= array[i] <= 1000"],
    example_test_cases: [
      { input: { array: [1, 2, 3, 4, 5] }, output: 15 },
      { input: { array: [-1, 0, 1] }, output: 0 }
    ]
  },
  {
    qname: "String Palindrome Check",
    description: "Given a string, determine if it is a palindrome. A palindrome reads the same forwards and backwards.",
    constraints: ["1 <= string.length <= 1000", "Only lowercase letters"],
    example_test_cases: [
      { input: { string: "racecar" }, output: true },
      { input: { string: "hello" }, output: false }
    ]
  },
  {
    qname: "Two Sum Problem",
    description: "Given an array of integers and a target sum, find two numbers that add up to the target.",
    constraints: ["2 <= array.length <= 1000", "-1000 <= array[i] <= 1000", "Only one valid solution exists"],
    example_test_cases: [
      { input: { array: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
      { input: { array: [3, 2, 4], target: 6 }, output: [1, 2] }
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
        
        // POST the generated question data to `/question/${qid}`
        try {
          await axios.post(`/question/${qid}`, questionData);
          console.log("Successfully posted question:", questionData.qname);
          return { qid, questionData };
        } catch (error) {
          console.error("Error posting question data:", error);
          // Even if posting fails, return the question data
          return { qid, questionData };
        }
      }
      
      throw new Error("Failed to generate question and no fallback available");
    },
    'get_next_question'
  );
};