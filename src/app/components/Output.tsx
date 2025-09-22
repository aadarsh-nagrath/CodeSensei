"use client";
import React, { useState, useEffect } from 'react';
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
import { isSessionValid } from '@/lib/session';
import { useLoginModal } from '@/lib/login-modal-context';
import { Play, ChevronRight, Terminal, AlertCircle, CheckCircle, Loader2, Code2, Zap } from 'lucide-react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const { openLoginModal } = useLoginModal();

  // Check authentication status
  useEffect(() => {
    setIsAuthenticated(isSessionValid());
  }, []);

  const runcode = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      toast("Authentication Required", {
        description: "Please log in to run code and access all features.",
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

    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      toast("No Code to Run", {
        description: "Please write some code first!",
        duration: 2000,
      });
      return;
    }

    try {
      setIsLoading(true);
      setIsSheetOpen(true);
      const startTime = Date.now();
      
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
      
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
      
      // Success toast
      toast("Code Executed Successfully!", {
        description: `Execution completed in ${endTime - startTime}ms`,
        duration: 2000,
      });
    } catch (error) {
      setIsError(true);
      toast("Execution Error", {
        description: "Unable to run code! Check your syntax and try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ahead = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      toast("Authentication Required", {
        description: "Please log in to generate new questions and access all features.",
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

    try {
      setIsGeneratingQuestion(true);
      const nextQuestion = await getNextQuestion();
      if (nextQuestion?.qid) {
        router.push(`/question/${nextQuestion.qid}`);
        toast("New Question Generated!", {
          description: "Get ready for your next challenge!",
          duration: 2000,
        });
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
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Run Code Button */}
        <Button
          onClick={runcode}
          disabled={isLoading}
          className={`
            relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95
            ${isAuthenticated 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-green-500/25' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 cursor-not-allowed opacity-70'
            }
            px-6 py-3 rounded-full font-semibold text-white border-0
            ${isLoading ? 'animate-pulse' : ''}
          `}
          style={{
            boxShadow: isAuthenticated 
              ? '0 8px 32px rgba(34, 197, 94, 0.3)' 
              : '0 4px 16px rgba(0, 0, 0, 0.2)'
          }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>Run Code</span>
            </div>
          )}
        </Button>

        {/* Next Question Button */}
        <Button
          onClick={ahead}
          disabled={isGeneratingQuestion}
          className={`
            relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95
            ${isAuthenticated 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 cursor-not-allowed opacity-70'
            }
            px-6 py-3 rounded-full font-semibold text-white border-0
            ${isGeneratingQuestion ? 'animate-pulse' : ''}
          `}
          style={{
            boxShadow: isAuthenticated 
              ? '0 8px 32px rgba(59, 130, 246, 0.3)' 
              : '0 4px 16px rgba(0, 0, 0, 0.2)'
          }}
        >
          {isGeneratingQuestion ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              <span>Next Question</span>
            </div>
          )}
        </Button>
      </div>

      {/* Cool Output Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
          side="left" 
          className="w-[85%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] bg-gradient-to-br from-gray-900 via-gray-800 to-black border-l border-gray-700"
        >
          <SheetHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                  Code Output
                  {isError ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </SheetTitle>
                <SheetDescription className="text-gray-400">
                  {isError ? "Execution completed with errors" : "Execution completed successfully"}
                </SheetDescription>
              </div>
            </div>

            {/* Execution Stats */}
            {executionTime > 0 && (
              <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Execution Time:</span>
                  <span className="text-sm font-mono text-yellow-400">{executionTime}ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Language:</span>
                  <span className="text-sm font-mono text-blue-400 capitalize">{language}</span>
                </div>
              </div>
            )}
          </SheetHeader>

          {/* Output Display */}
          <div className="flex-1 mt-6">
            <div className="h-[60vh] bg-black/50 rounded-lg border border-gray-700 overflow-hidden">
              <div className="h-full bg-gray-900/80 rounded-lg border border-gray-600 overflow-auto">
                <div className="p-4 font-mono text-sm">
                  {output.length > 0 ? (
                    <div className="space-y-1">
                      {output.map((line: string, index: number) => (
                        <div 
                          key={index} 
                          className={`${
                            isError ? 'text-red-400' : 'text-green-400'
                          } whitespace-pre-wrap`}
                        >
                          {line || '\u00A0'}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Terminal className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium">No Output Yet</p>
                      <p className="text-sm">Click &quot;Run Code&quot; to see your output here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-6">
            <div className="flex gap-3 w-full">
              <SheetClose asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  Close
                </Button>
              </SheetClose>
              <Button 
                onClick={runcode}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    <span>Run Again</span>
                  </div>
                )}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Output;
