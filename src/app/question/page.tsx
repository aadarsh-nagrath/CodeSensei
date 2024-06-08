"use client"

import React, { useEffect, useState } from 'react';
import CustomDialog from '../components/openingModal';
import CodeEditor from '../components/codeEditor';
import NavigationMenu from '../components/NavigationMenu';
import './page.css';


const QuestionPage = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <div>
      <NavigationMenu/>
      <CustomDialog open={open} onClose={handleClose} />
      <div className="code-editor-container">
        <CodeEditor />
      </div>
    </div>
  );
};

export default QuestionPage;