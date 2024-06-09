import axios from "axios";
import { Language_versions } from "./constant";
import { useRouter } from "next/router";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure environment variables are loaded
if (typeof window === 'undefined') {
  require('dotenv').config();
}

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GENAI_API_KEY || ""
);

const interestArray = ["spiderman", "batman and joker", "sucide squad", "doraemon", "attack on titans"];

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
};

async function newQuestion(topic: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Build me an innovative, never created before DSA question just like in leetcode, the question should be related to ${topic}, also give two example test cases for the question, constraints, description, Qname, provide answer only in json format directly starting from "{" to "}" nothing else`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = await response.text();
  // Check if response is not JSON
  if (!text.startsWith('{')) {
    console.log(text);
    return null;
  }
  // Remove first and last lines
  text = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
  console.log(JSON.parse(text));
  return JSON.parse(text);
}

// API for next Question
export const getNextQuestion = async () => {
  const num = Math.floor(Math.random() * 10) + 1;
  if (num < 2) {
    // popular Question
  } else {
    const qid = generateUniqueId();
    const interest = getRandomValue(interestArray);
    const questionData = await newQuestion(interest);

    // POST the generated question data to `/question/${qid}`
    await axios.post(`/question/${qid}`, questionData);

    return qid;
  }
};