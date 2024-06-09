import React from 'react';
import './DisplayQuestion.css';

interface ExampleTestCase {
  input: any; // Can be any JSON structure
  output: any; // Can be any JSON structure
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

  const renderConstraints = (constraints: { [key: string]: string } | undefined) => {
    if (!constraints) return null;

    return (
      <div className="question-constraints">
        <h3 className="question-subheading">Constraints:</h3>
          <p className="constraint">{question.constraints}</p>
      </div>
    );
  };

  return (
    <div className="question-container">
      <h1 className="question-name">{question.qname}</h1>
      <p className="question-description">{question.description}</p>
      {renderConstraints(question.constraints)}
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
