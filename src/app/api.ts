import axios from "axios";
import { Language_versions } from "./constant";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

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
