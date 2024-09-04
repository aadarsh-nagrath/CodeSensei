import React from 'react';
import './DisplayQuestion.css';

interface ExampleTestCase {
  input: any;
  output: any;
}

interface QuestionData {
  qname: string;
  description: string;
  constraints?: { [key: string]: string };
  example_test_cases: ExampleTestCase[];
}

interface DisplayQuestionProps {
  question: QuestionData;
}

const DisplayQuestion: React.FC<DisplayQuestionProps> = ({ question }) => {
  const renderInput = (input: any) => {
    const renderNestedInput = (obj: any, depth: number) => {
      if (typeof obj !== 'object' || obj === null) {
        return <span>{obj}</span>;
      }
      return (
        <div style={{ marginLeft: depth * 20 }}>
          {Object.keys(obj).map((key) => (
            <div key={key}>
              <span>{key}: </span>
              {renderNestedInput(obj[key], depth + 1)}
            </div>
          ))}
        </div>
      );
    };

    return renderNestedInput(input, 0);
  };

  // Function to format constraints into a readable string
  const formatConstraints = (constraints: { [key: string]: string } | undefined): string | undefined => {
    if (!constraints) return undefined;

    return Object.entries(constraints)
      .map(([key, value]) => `${value}`)
      .join('');
  };

  // Render constraints as a formatted string
  const renderConstraints = (constraints: string | undefined) => {
    if (!constraints) return null;

    return (
      <div className="question-constraints">
        <h3 className="question-subheading">Constraints:</h3>
        <p className="constraint">{constraints}</p>
      </div>
    );
  };

  return (
    <div className="question-container">
      <h1 className="question-name">{question.qname}</h1>
      <p className="question-description">{question.description}</p>
      {renderConstraints(formatConstraints(question.constraints))}
      {question.example_test_cases.map((testCase, index) => (
        <div key={index} className="test-case">
          <h3 className="question-subheading">Test Case {index + 1}</h3>
          <div className="test-case-input">
            <h4>Input:</h4>
            <div className="input-data">
              {renderInput(testCase.input)}
            </div>
          </div>
          <div className="test-case-output">
            <h4>Output:</h4>
            <pre>{JSON.stringify(testCase.output, null, 2)}</pre>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayQuestion;