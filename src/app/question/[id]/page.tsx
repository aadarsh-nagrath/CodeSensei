"use client"

import React, { useEffect, useState } from 'react';
import CustomDialog from '../../components/openingModal';
import CodeEditor from '../../components/codeEditor';
import NavigationMenu from '../../components/NavigationMenu';
import './page.css';
import DisplayQuestion from '@/app/components/DisplayQuestion';
import { getNextQuestion } from '@/app/api';

const sampleData1 = {
  "qname": "Spiderman's Web Swing Optimization",
  "description": "Spiderman is swinging through the city using his webs. He has a list of buildings represented by their heights. He can swing from one building to another only if the difference in their heights is less than or equal to his maximum jump height. He wants to find the minimum number of swings required to reach the last building from the first building.  Given an array of building heights and Spiderman's maximum jump height, determine the minimum number of swings needed.",
  "constraints": "1 <= len(heights) <= 10^5\n1 <= heights[i] <= 10^9\n1 <= max_jump_height <= 10^9",
  "example_test_cases": [
      {
          "input": {
              "heights": [
                  10,
                  5,
                  15,
                  20,
                  10,
                  5
              ],
              "max_jump_height": 5
          },
          "output": 4
      },
      {
          "input": {
              "heights": [
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10
              ],
              "max_jump_height": 2
          },
          "output": 9
      }
  ]
};

interface QuestionData {
  qname: string;
  description: string;
  constraints: string;
  anythingelse: string;
  example_test_cases: { input: string; output: number }[];
}

const QuestionPage = () => {
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);

  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl === 'http://localhost:3000/question/1') {
      setQuestionData(sampleData1);
    } else {
      const fetchData = async () => {
        try {
          const { questionData } = await getNextQuestion() as { questionData: QuestionData };
          setQuestionData(questionData);
        } catch (error) {
          console.error("Error fetching question:", error);
        }
      };
      fetchData();
    }
  }, []);  
  // Empty dependency array ensures this effect runs only once, like componentDidMount

  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl === 'http://localhost:3000/question/1') {
      setOpen(true);
    }
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <div>
      <NavigationMenu/>
      <CustomDialog open={open} onClose={handleClose} />
      <div className="code-editor-container">
        {questionData && <DisplayQuestion  question={questionData}/>}
        <CodeEditor />
      </div>
    </div>
  );
};

export default QuestionPage;