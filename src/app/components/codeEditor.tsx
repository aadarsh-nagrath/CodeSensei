import { Editor } from '@monaco-editor/react';
import React, { useRef, useState } from 'react';
import LanguageSelector from './languageSelector';
import { CODE_SNIPPETS } from '../constant';
import Output from './Output';

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");

  const editorOnMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const languageSelect = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setCode(CODE_SNIPPETS[selectedLanguage as keyof typeof CODE_SNIPPETS]);
  };

  return (
    <>
      <div>
      <LanguageSelector language={language} languageSelect={languageSelect} />
      <Editor
        height="80vh"
        width="90vh"
        theme="vs-dark"
        language={language}
        onMount={editorOnMount}
        defaultValue={
          "// Happy Coding! " +
          CODE_SNIPPETS[language as keyof typeof CODE_SNIPPETS].replace(
            /\n/g,
            "\n"
          )
        }
        value={code}
        onChange={(value: string | undefined) => value && setCode(value)}
      />
      </div>
      <div>
      <Output language={language} editorRef={editorRef} />
      </div>
    </>
  );
};

export default CodeEditor;
