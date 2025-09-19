"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bookmark, Eye, Clock, Code2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { isSessionValid } from '@/lib/session';
import { toast } from 'sonner';

interface SavedQuestion {
  _id: string;
  questionId: string;
  questionData: {
    qname: string;
    description: string;
    constraints?: string[] | { [key: string]: string };
    example_test_cases: Array<{
      input: any;
      output: any;
    }>;
  };
  savedAt: string;
}

const SavedQuestions = () => {
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    setIsAuthenticated(isSessionValid());
  }, []);

  // Fetch saved questions when drawer opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchSavedQuestions();
    }
  }, [isOpen, isAuthenticated]);

  const fetchSavedQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/saved-questions');
      if (response.ok) {
        const data = await response.json();
        setSavedQuestions(data.savedQuestions || []);
      } else {
        throw new Error('Failed to fetch saved questions');
      }
    } catch (error) {
      console.error('Error fetching saved questions:', error);
      toast("Error", {
        description: "Failed to load saved questions.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewQuestion = (questionId: string) => {
    router.push(`/question/${questionId}`);
    setIsOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleOpen = () => {
    if (!isAuthenticated) {
      toast("Authentication Required", {
        description: "Please log in to view your saved questions.",
        duration: 3000,
      });
      return;
    }
    setIsOpen(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          onClick={handleOpen}
          variant="ghost"
          className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden sm:inline">Saved Questions</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="bottom" 
        className="h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black border-t border-gray-700"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            Your Saved Questions
          </SheetTitle>
        </SheetHeader>

        <div className="h-full overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your saved questions...</p>
              </div>
            </div>
          ) : savedQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bookmark className="w-16 h-16 text-gray-500 mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Saved Questions Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Start solving problems and bookmark your favorites to see them here!
              </p>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start Practicing
              </Button>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="grid gap-4">
                {savedQuestions.map((item) => (
                  <div
                    key={item._id}
                    className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 hover:bg-gray-800/70 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                          {item.questionData.qname}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {item.questionData.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Saved {formatDate(item.savedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Code2 className="w-3 h-3" />
                            <span>ID: {item.questionId}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleViewQuestion(item.questionId)}
                        className="ml-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SavedQuestions;
