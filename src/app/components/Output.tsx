"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { executeCode, getNextQuestion } from '../api';
import { toast } from "sonner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from 'next/navigation';
import QuestionLoader from './QuestionLoader';

const Output = ({
  language,
  editorRef,
}: {
  language: string;
  editorRef: any;
}) => {
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const router = useRouter();

  const runcode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(
        language as
          | "java"
          | "python"
          | "javascript"
          | "csharp"
          | "typescript"
          | "php",
        sourceCode
      );
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      toast("An error occurred", {
        description: "Unable to run code!",
        duration: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ahead = async () => {
    try {
      setIsGeneratingQuestion(true);
      const nextQuestion = await getNextQuestion();
      if (nextQuestion?.qid) {
        router.push(`/question/${nextQuestion.qid}`);
      } else {
        toast("Unable to get the next question", {
          description: "Please try again later.",
          duration: 1500,
        });
      }
    } catch (error) {
      console.error("Error getting next question:", error);
      toast("Error generating question", {
        description: "Please try again later.",
        duration: 1500,
      });
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  return (
    <div className="z-10">
      <QuestionLoader isVisible={isGeneratingQuestion} />
      <Sheet>
        <SheetTrigger asChild>
          <Button className='' variant="destructive" style={{position: 'fixed', bottom: '20px', right: '10%', transform: 'translateX(-50%)'}} onClick={runcode} disabled={isLoading}>
            {isLoading ? "Running..." : "Run Code"}
          </Button>
        </SheetTrigger>
        <Button 
          style={{position: 'fixed', bottom: '20px', right: '5%', transform: 'translateX(-50%)'}} 
          variant="green" 
          onClick={ahead}
          disabled={isGeneratingQuestion}
        >
          {isGeneratingQuestion ? "Generating..." : "NEXT"}
        </Button>
        <SheetContent side={'left'} className="w-[50%] sm:w-[540px] bg-[#1e1e1e]">
          <SheetHeader>
            <SheetTitle>Output: </SheetTitle>
            <SheetDescription>
              Make changes to your code to see output here, take.
            </SheetDescription>
            <div
              style={{
                height: "75vh",
                border: "1px solid",
                borderRadius: 4,
                borderColor: isError ? "red" : "#333",
                color: isError ? "red" : "#333",
                overflow: "auto",
                padding: 10,
                margin: 10,
              }}
            >
              {output.length > 0
                ? output.map((line: string, index: number) => (
                    <p key={index}>{line}</p>
                  ))
                : "Click on Run Code to see Output"}
            </div>
          </SheetHeader>
          <div className="grid gap-4 py-4"></div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Output;
