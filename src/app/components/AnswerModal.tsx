import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Clock, 
  Cpu, 
  Lightbulb, 
  Code, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  answerData: {
    approach: string;
    solution: string;
    timeComplexity: string;
    spaceComplexity: string;
    explanation: string;
    edgeCases: string;
    alternativeApproaches: string;
  };
  language: string;
  isCached?: boolean;
}

const AnswerModal: React.FC<AnswerModalProps> = ({ 
  isOpen, 
  onClose, 
  answerData, 
  language,
  isCached = false
}) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const getLanguageIcon = (lang: string) => {
    const icons: { [key: string]: string } = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      c: '🔧',
      typescript: '🔷',
      go: '🐹',
      rust: '🦀',
      php: '🐘',
      ruby: '💎',
      swift: '🦉',
      kotlin: '🟣',
    };
    return icons[lang.toLowerCase()] || '💻';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[95vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black border-gray-700 flex flex-col">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white flex items-center space-x-3">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <span>AI Solution</span>
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                {getLanguageIcon(language)} {language.toUpperCase()}
              </Badge>
              {isCached && (
                <Badge variant="outline" className="text-green-500 border-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Cached
                </Badge>
              )}
            </DialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Approach Section */}
          {answerData.approach && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>Approach</span>
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {answerData.approach}
              </p>
            </div>
          )}

          {/* Solution Section */}
          {answerData.solution && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-400 flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>Solution</span>
                </h3>
                <Button
                  onClick={() => copyToClipboard(answerData.solution, 'Solution')}
                  variant="outline"
                  size="sm"
                  className="text-gray-400 hover:text-white border-gray-600 hover:border-gray-500"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>
              <div className="relative">
                <pre className="bg-gray-900/80 rounded-xl p-4 overflow-x-auto text-sm text-gray-100 border border-gray-700/50">
                  <code className={`language-${language.toLowerCase()}`}>
                    {answerData.solution}
                  </code>
                </pre>
              </div>
            </div>
          )}

          {/* Complexity Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
              <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Time Complexity</span>
              </h3>
              <p className="text-2xl font-bold text-white mb-2">
                {answerData.timeComplexity}
              </p>
              <p className="text-sm text-gray-400">
                How the runtime scales with input size
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center space-x-2">
                <Cpu className="w-5 h-5" />
                <span>Space Complexity</span>
              </h3>
              <p className="text-2xl font-bold text-white mb-2">
                {answerData.spaceComplexity}
              </p>
              <p className="text-sm text-gray-400">
                How memory usage scales with input size
              </p>
            </div>
          </div>

          {/* Explanation Section */}
          {answerData.explanation && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Detailed Explanation</span>
              </h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {answerData.explanation}
              </div>
            </div>
          )}

          {/* Edge Cases Section */}
          {answerData.edgeCases && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Edge Cases</span>
              </h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {answerData.edgeCases}
              </div>
            </div>
          )}

          {/* Alternative Approaches */}
          {answerData.alternativeApproaches && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-pink-400 mb-3 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Alternative Approaches</span>
              </h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {answerData.alternativeApproaches}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              onClick={() => copyToClipboard(answerData.solution, 'Complete solution')}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Solution
            </Button>
            {isCached && (
              <Button
                onClick={() => {
                  // This will trigger a regeneration by closing and reopening
                  onClose();
                  // You could add a regenerate callback here if needed
                }}
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnswerModal;
