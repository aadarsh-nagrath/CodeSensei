import React, { useState, useEffect, useCallback } from 'react';
import { Check, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isSessionValid } from '@/lib/session';
import { useLoginModal } from '@/lib/login-modal-context';

interface MarkSolvedButtonProps {
  questionId: string;
}

const MarkSolvedButton: React.FC<MarkSolvedButtonProps> = ({ questionId }) => {
  const [isSolved, setIsSolved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { openLoginModal } = useLoginModal();

  const checkSolvedStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/mark-solved?questionId=${questionId}`);
      if (response.ok) {
        const data = await response.json();
        setIsSolved(data.isSolved);
      }
    } catch (error) {
      console.error('Error checking solved status:', error);
    }
  }, [questionId]);

  // Check authentication status
  useEffect(() => {
    setIsAuthenticated(isSessionValid());
  }, []);

  // Check if question is already solved
  useEffect(() => {
    if (questionId && isAuthenticated) {
      checkSolvedStatus();
    }
  }, [questionId, isAuthenticated, checkSolvedStatus]);

  const handleMarkSolved = async () => {
    if (!isAuthenticated) {
      toast("Authentication Required", {
        description: "Please log in to mark questions as solved.",
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
      const response = await fetch('/api/mark-solved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (!result.alreadySolved) {
          setIsSolved(true);
          setShowAnimation(true);
          
          // Hide animation after 2 seconds
          setTimeout(() => {
            setShowAnimation(false);
          }, 2000);
          
          toast("Question Solved!", {
            description: "Great job! This question has been marked as solved.",
            duration: 3000,
          });
        } else {
          toast("Already Solved", {
            description: "This question is already marked as solved.",
            duration: 2000,
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark question as solved');
      }
    } catch (error) {
      console.error('Error marking question as solved:', error);
      toast("Error", {
        description: `Failed to mark question as solved: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleMarkSolved}
        disabled={isLoading || isSolved}
        variant={isSolved ? "default" : "outline"}
        size="sm"
        className={`
          transition-all duration-300 hover:scale-105
          ${isSolved 
            ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
            : 'bg-transparent hover:bg-green-50 text-green-600 border-green-600 hover:text-green-700'
          }
          ${isLoading ? 'animate-pulse' : ''}
          ${showAnimation ? 'animate-bounce' : ''}
        `}
        title={isSolved ? 'Question is solved' : 'Mark as solved'}
      >
        {isSolved ? (
          <CheckCircle className="w-4 h-4 mr-2" />
        ) : (
          <Check className="w-4 h-4 mr-2" />
        )}
        {isSolved ? 'Solved' : 'Mark as Solved'}
      </Button>
      
      {/* Tick Animation Overlay */}
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-ping">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkSolvedButton;
