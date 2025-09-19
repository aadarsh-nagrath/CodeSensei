import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import QuestionLoader from './QuestionLoader'

const GenereDialog = () => {
  const [interest, setInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleInterest = async () => {
    if (!interest.trim()) {
      toast.error("Please enter a topic of interest");
      return;
    }

    try {
      setIsLoading(true);
      setIsOpen(false); // Close dialog immediately
      console.log('Sending interest:', interest);
      
      // First, save the interest to the database
      const res = await fetch('/interests/topic', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ interest: interest.trim() }),
      });
  
      if (!res.ok) {
        const errorData = await res.text();
        console.error('Error response:', errorData);
        throw new Error('An error occurred: ' + errorData);
      }
  
      const data = await res.json();
      console.log('Server response:', data);

      // Now generate a question with this specific interest
      const questionRes = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: interest.trim(),
          difficulty: 'medium' // Default difficulty
        }),
      });

      if (!questionRes.ok) {
        throw new Error('Failed to generate question');
      }

      const questionData = await questionRes.json();
      console.log('Generated question:', questionData);

      if (questionData.qid) {
        toast.success(`Generating question about ${interest}...`);
        setInterest(''); // Clear the input
        router.push(`/question/${questionData.qid}`);
      } else {
        throw new Error('No question ID received');
      }

    } catch (error) {
      console.error('Error in handleInterest:', error);
      toast.error("Failed to generate question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && isLoading) {
      // If dialog is closed while loading, reset loading state
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <QuestionLoader isVisible={isLoading} />
      <DialogTrigger asChild>
        <Button variant="outline">Choose Interest</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Type any topic of Interest</DialogTitle>
          <br/>
          <DialogDescription>
            To help you find relevant questions 
            Simply type your topic into the box and hit enter. Example - &quot;Marvel&quot;, &quot;Demon Slayer&quot;, etc.<br/><br/>
            We&apos;ll display questions related to your chosen topic.<br/>
            Happy learning!🙃
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interest" className="text-right">
              Interest
            </Label>
            <Input
              id="username"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleInterest} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Go for it"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GenereDialog;
