import axios from "axios";
import { Language_versions } from "./constant";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure environment variables are loaded
if (typeof window === 'undefined') {
  require('dotenv').config();
}

interface EnhancedGenerateContentResponse {
  qname: string;
  description: string;
}

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GENAI_API_KEY || ""
);

let interestArray: Array<string> = [];

const fetchTopics = async () => {
  try {
    const response = await fetch('/interests/topic');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    interestArray = await response.json();
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

async function newQuestion(topic: string) {
  try {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Build me a innovative, never created before DSA question just like in leetcode, the question should be related to ${topic}, also give two example test cases for the question(example_test_cases), constraints, description, question name (qname), provide answer only in json format (keys in lowercase) directly starting from "{" to "}" nothing else, order of keys -> qname, description, constriants, example_test_cases. Make sure the test cases and are correct properly`;

    const result = await model.generateContent(prompt);
    if (!result || !result.response) {
      throw new Error("Invalid response from generateContent");
    }

    const response = result.response;
    const text = await response.text();

    // Check if response is not JSON
    if (!text.startsWith("{")) {
      console.log("Non-JSON response:", text);
      const jsonObject = convertToJsonAndLog(text);
      return jsonObject;
    }

    // Remove first and last lines
    const jsonData = text.substring(
      text.indexOf("{"),
      text.lastIndexOf("}") + 1
    );
    const questionData = JSON.parse(jsonData);

    console.log("Parsed question data:", questionData);

    return questionData;
  } catch (error) {
    console.error("Error generating new question:", error);
    getNextQuestion();
    return null;
  }
}


// API for next Question
export const getNextQuestion = async () => {
  const num = Math.floor(Math.random() * 10) + 1;
  if (num < 2) {
    // Handle popular question scenario
  } else {
    const qid = generateUniqueId();
    await fetchTopics();
    if(interestArray.length === 0) {
      interestArray = ["spiderman", "batman and joker", "suicide squad", "doraemon", "attack on titans"];
    }
    const interest = getRandomValue(interestArray);
    const questionData = await newQuestion(interest);

    // POST the generated question data to `/question/${qid}`
    try {
      await axios.post(`/question/${qid}`, questionData);
      return { qid, questionData };
    } catch (error) {
      console.error("Error posting question data:", error);
      throw error;
    }
  }
};