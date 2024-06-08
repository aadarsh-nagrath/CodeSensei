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
 
const GenereDialog = () => {
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
          Simply type your topic into the box and hit enter. Example - "Marvel", "Demon Slayer",etc <br/><br/>We'll display questions related to your chosen topic. <br/>Happy learning!🙃
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interest" className="text-right">
              Interest
            </Label>
            <Input
              id="username"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Go for it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GenereDialog;