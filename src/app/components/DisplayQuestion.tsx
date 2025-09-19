import React from 'react';
import './DisplayQuestion.css';

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
}

const DisplayQuestion: React.FC<DisplayQuestionProps> = ({ question }) => {
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
        <div className="question-icon">💻</div>
        <h1 className="question-title">{question.qname}</h1>
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

      {/* Test Cases Section */}
      <div className="test-cases-section">
        <div className="section-header">
          <div className="section-icon">🧪</div>
          <h3 className="section-title">Example Test Cases</h3>
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
                
                <div className="output-section">
                  <div className="output-label">
                    <span className="output-icon">📤</span>
                    Output
                  </div>
                  <div className="output-container">
                    {renderOutput(testCase.output)}
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