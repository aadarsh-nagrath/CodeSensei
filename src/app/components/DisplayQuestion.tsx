import React, { useState, useEffect, useCallback } from 'react';
import './DisplayQuestion.css';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isSessionValid } from '@/lib/session';
import { useLoginModal } from '@/lib/login-modal-context';

interface ExampleTestCase {
  input: any;
  output: any;
}

interface QuestionData {
  qname: string;
  description: string;
  constraints?: string[] | { [key: string]: string };
  example_test_cases: ExampleTestCase[];
}

interface DisplayQuestionProps {
  question: QuestionData;
  questionId?: string;
}

const DisplayQuestion: React.FC<DisplayQuestionProps> = ({ question, questionId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { openLoginModal } = useLoginModal();

  const checkBookmarkStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/saved-questions/check?questionId=${questionId}`);
      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.isBookmarked);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  }, [questionId]);

  // Check authentication status
  useEffect(() => {
    setIsAuthenticated(isSessionValid());
  }, []);

  // Check if question is already bookmarked
  useEffect(() => {
    if (questionId && isAuthenticated) {
      checkBookmarkStatus();
    }
  }, [questionId, isAuthenticated, checkBookmarkStatus]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast("Authentication Required", {
        description: "Please log in to save questions.",
        duration: 3000,
        action: {
          label: "Login",
          onClick: () => {
            openLoginModal();
          }
        }
      });
      return;
    }

    if (!questionId) {
      toast("Error", {
        description: "Question ID not available.",
        duration: 2000,
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Saving question:', { questionId, isBookmarked });
      
      const response = await fetch('/api/saved-questions', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          questionData: question,
        }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Response data:', result);
        
        setIsBookmarked(!isBookmarked);
        toast(
          isBookmarked ? "Question Removed" : "Question Saved",
          {
            description: isBookmarked 
              ? "Question removed from your saved questions." 
              : "Question saved to your bookmarks!",
            duration: 2000,
          }
        );
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to save question');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      toast("Error", {
        description: `Failed to save question: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Enhanced input rendering with better formatting
  const renderInput = (input: any, depth: number = 0): JSX.Element => {
    if (input === null || input === undefined) {
      return <span className="value-null">null</span>;
    }
    
    if (typeof input === 'boolean') {
      return <span className="value-boolean">{input.toString()}</span>;
    }
    
    if (typeof input === 'number') {
      return <span className="value-number">{input}</span>;
    }
    
    if (typeof input === 'string') {
      return <span className="value-string">&quot;{input}&quot;</span>;
    }
    
    if (Array.isArray(input)) {
      if (input.length === 0) {
        return <span className="array-bracket">[]</span>;
      }
      
      // Check if it's a simple array (all primitives)
      const isSimpleArray = input.every(item => 
        typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean' || item === null
      );
      
      if (isSimpleArray) {
        return (
          <span className="simple-array">
            <span className="array-bracket">[</span>
            {input.map((item, index) => (
              <span key={index}>
                {renderInput(item, depth + 1)}
                {index < input.length - 1 && <span className="comma">, </span>}
              </span>
            ))}
            <span className="array-bracket">]</span>
          </span>
        );
      }
      
      return (
        <div className="array-container">
          <span className="array-bracket">[</span>
          <div className="array-content">
            {input.map((item, index) => (
              <div key={index} className="array-item">
                {renderInput(item, depth + 1)}
                {index < input.length - 1 && <span className="comma">,</span>}
              </div>
            ))}
          </div>
          <span className="array-bracket">]</span>
        </div>
      );
    }
    
    if (typeof input === 'object') {
      const keys = Object.keys(input);
      if (keys.length === 0) {
        return <span className="object-bracket">{"{}"}</span>;
      }
      
      return (
        <div className="object-container">
          <span className="object-bracket">{"{"}</span>
          <div className="object-content">
            {keys.map((key, index) => (
              <div key={key} className="object-item">
                <span className="object-key">&quot;{key}&quot;:</span>
                {renderInput(input[key], depth + 1)}
                {index < keys.length - 1 && <span className="comma">,</span>}
              </div>
            ))}
          </div>
          <span className="object-bracket">{"}"}</span>
        </div>
      );
    }
    
    return <span className="value-other">{String(input)}</span>;
  };

  // Enhanced output rendering
  const renderOutput = (output: any): JSX.Element => {
    if (output === null || output === undefined) {
      return <span className="output-null">null</span>;
    }
    
    if (typeof output === 'boolean') {
      return <span className="output-boolean">{output.toString()}</span>;
    }
    
    if (typeof output === 'number') {
      return <span className="output-number">{output}</span>;
    }
    
    if (typeof output === 'string') {
      return <span className="output-string">&quot;{output}&quot;</span>;
    }
    
    if (Array.isArray(output)) {
      return (
        <div className="output-array">
          <span className="array-bracket">[</span>
          {output.map((item, index) => (
            <span key={index}>
              {renderOutput(item)}
              {index < output.length - 1 && <span className="comma">, </span>}
            </span>
          ))}
          <span className="array-bracket">]</span>
        </div>
      );
    }
    
    return <span className="output-other">{JSON.stringify(output)}</span>;
  };

  // Render constraints with better formatting
  const renderConstraints = (constraints: string[] | { [key: string]: string } | undefined) => {
    if (!constraints) return null;

    let constraintList: string[] = [];

    // Handle both array and object formats
    if (Array.isArray(constraints)) {
      constraintList = constraints;
    } else if (typeof constraints === 'object') {
      // Convert object format to array
      constraintList = Object.entries(constraints).map(([key, value]) => {
        if (key && value) {
          return `${key}: ${value}`;
        }
        return value;
      });
    }

    if (constraintList.length === 0) return null;

    return (
      <div className="constraints-section">
        <div className="section-header">
          <div className="section-icon">⚠️</div>
          <h3 className="section-title">Constraints</h3>
        </div>
        <div className="constraints-list">
          {constraintList.map((constraint, index) => (
            <div key={index} className="constraint-item">
              <span className="constraint-bullet">•</span>
              <span className="constraint-text">{constraint}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="question-container">
      {/* Header Section */}
      <div className="question-header">
        <div className="question-icon">𝐐</div>
        <h1 className="question-title">{question.qname}</h1>
        <Button
          onClick={handleBookmark}
          disabled={isLoading}
          variant="ghost"
          size="icon"
          className={`
            ml-auto transition-all duration-200 hover:scale-110
            ${isBookmarked 
              ? 'text-yellow-500 hover:text-yellow-400' 
              : 'text-gray-400 hover:text-yellow-500'
            }
            ${isLoading ? 'animate-pulse' : ''}
          `}
          title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Description Section */}
      <div className="description-section">
        <div className="section-header">
          <div className="section-icon">📝</div>
          <h3 className="section-title">Problem Description</h3>
        </div>
        <p className="question-description">{question.description}</p>
      </div>

      {/* Constraints Section */}
      {renderConstraints(question.constraints)}

      {/* Test Cases Section (hide expected outputs) */}
      <div className="test-cases-section">
        <div className="section-header">
          <div className="section-icon">🧪</div>
          <h3 className="section-title">Example Inputs</h3>
        </div>
        <div className="test-cases-grid">
          {question.example_test_cases.map((testCase, index) => (
            <div key={index} className="test-case-card">
              <div className="test-case-header">
                <div className="test-case-number">Test Case {index + 1}</div>
                <div className="test-case-badge">Example</div>
              </div>
              
              <div className="test-case-content">
                <div className="input-section">
                  <div className="input-label">
                    <span className="input-icon">📥</span>
                    Input
                  </div>
                  <div className="input-container">
                    {renderInput(testCase.input)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayQuestion;