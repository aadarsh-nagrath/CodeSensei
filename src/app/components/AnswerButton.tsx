import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AnswerModal from './AnswerModal';

interface AnswerButtonProps {
  questionId: string;
  currentLanguage: string;
}

const AnswerButton: React.FC<AnswerButtonProps> = ({ questionId, currentLanguage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [answerData, setAnswerData] = useState<any>(null);
  const [isCached, setIsCached] = useState(false);

  const handleGenerateAnswer = async (forceRegenerate = false) => {
    if (!questionId || !currentLanguage) {
      toast.error('Missing question ID or language selection');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          language: currentLanguage,
          forceRegenerate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate answer');
      }

      const data = await response.json();
      setAnswerData(data.answer);
      setIsCached(data.cached || false);
      setShowModal(true);
      
      if (data.cached) {
        toast.success('Solution loaded from cache!');
      } else {
        toast.success('AI solution generated successfully!');
      }
    } catch (error) {
      console.error('Error generating answer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate answer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => handleGenerateAnswer()}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className={`
          relative transition-all duration-300 ease-in-out
          text-gray-400 hover:text-yellow-500 border-gray-700 hover:border-yellow-500
          hover:bg-yellow-500/10
          ${isLoading ? 'animate-pulse' : ''}
        `}
        title="Get AI Solution"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Lightbulb className="w-4 h-4 mr-2" />
        )}
        {isLoading ? 'Generating...' : 'Get Answer'}
      </Button>

      {showModal && answerData && (
        <AnswerModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          answerData={answerData}
          language={currentLanguage}
          isCached={isCached}
        />
      )}
    </>
  );
};

export default AnswerButton;
