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
import {useState } from "react"

const GenereDialog = () => {
  const [interest, setInterest] = useState('');
  const handleInterest = async () => {
    try {
      console.log('Sending interest:', interest); // Log the interest being sent
      const res = await fetch('/interests/topic', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ interest }),
      });
  
      if (!res.ok) {
        const errorData = await res.text();
        console.error('Error response:', errorData);
        throw new Error('An error occurred: ' + errorData);
      }
  
      const data = await res.json();
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error in handleInterest:', error);
    }
  };
  

  return (
    <Dialog>
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
          <Button onClick={handleInterest} type="submit">Go for it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GenereDialog;
