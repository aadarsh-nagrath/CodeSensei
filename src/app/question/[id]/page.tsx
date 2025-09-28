"use client"

import React, { useEffect, useState } from 'react';
import CustomDialog from '../../components/openingModal';
import CodeEditor from '../../components/codeEditor';
import ProfileDrawer from '../../components/ProfileDrawer';
import GenereDialog from '../../components/GenereDialog';
import QuestionLoader from '../../components/QuestionLoader';
import SavedQuestions from '../../components/SavedQuestions';
import MarkSolvedButton from '../../components/MarkSolvedButton';
import AnswerButton from '../../components/AnswerButton';
import './page.css';
import DisplayQuestion from '@/app/components/DisplayQuestion';
import { getNextQuestion } from '@/app/api';
import { isSessionValid } from '@/lib/session';

const sampleData1: QuestionData = {
  "qname": "Spiderman's Web Swing Optimization",
  "description": "Spiderman is swinging through the city using his webs. He has a list of buildings represented by their heights. He can swing from one building to another only if the difference in their heights is less than or equal to his maximum jump height. He wants to find the minimum number of swings required to reach the last building from the first building. Given an array of building heights and Spiderman's maximum jump height, determine the minimum number of swings needed.",
  "constraints": {
    "Building heights": "1 <= len(heights) <= 10^5\n1 <= heights[i] <= 10^9\n1 <= max_jump_height <= 10^9"
  },
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
  constraints?: string[] | { [key: string]: string };
  example_test_cases: Array<{
    input: any;
    output: any;
  }>;
}


const QuestionPage = () => {
  const [open, setOpen] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [questionId, setQuestionId] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState<string>('java');

  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl === 'http://localhost:3000/question/1') {
      setQuestionData(sampleData1);
    } else {
      const fetchData = async () => {
        try {
          setIsLoadingQuestion(true);
          
          // Extract question ID from URL
          const urlParts = currentUrl.split('/');
          const extractedQuestionId = urlParts[urlParts.length - 1];
          setQuestionId(extractedQuestionId);
          
          // First try to fetch the specific question from database
          if (extractedQuestionId && extractedQuestionId !== '1') {
            try {
              const response = await fetch(`/api/question?qid=${extractedQuestionId}`);
              if (response.ok) {
                const questionData = await response.json();
                setQuestionData(questionData);
                setIsLoadingQuestion(false);
                return;
              }
            } catch (error) {
              console.log("Question not found in database, generating new one");
            }
          }
          
          // If specific question not found, generate a new one
          const { questionData } = await getNextQuestion() as { questionData: QuestionData };
          setQuestionData(questionData);
        } catch (error) {
          console.error("Error fetching question:", error);
        } finally {
          setIsLoadingQuestion(false);
        }
      };
      fetchData();
    }
  }, []);  
  
  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl === 'http://localhost:3000/question/1') {
      // Check if user has a valid session
      if (!isSessionValid()) {
        setOpen(true);
      }
    }
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <div>
      <CustomDialog open={open} onClose={handleClose} />
      <QuestionLoader isVisible={isLoadingQuestion} />
      
      {/* Fixed Header with Profile Button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">Code Sensei</h1>
            <span className="text-sm text-gray-400">Practice Mode</span>
            <GenereDialog />
          </div>
          <div className="flex items-center space-x-4">
            {questionData && questionId && (
              <AnswerButton questionId={questionId} currentLanguage={currentLanguage} />
            )}
            {questionData && questionId && (
              <MarkSolvedButton questionId={questionId} />
            )}
            <SavedQuestions />
            <ProfileDrawer />
          </div>
        </div>
      </header>

      {/* Main Content with Top Padding */}
      <div className="pt-20">
        <div className="code-editor-container">
          {questionData && <DisplayQuestion question={questionData} questionId={questionId} />}
          <CodeEditor language={currentLanguage} onLanguageChange={setCurrentLanguage} />
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;