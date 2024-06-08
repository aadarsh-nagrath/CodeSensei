import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const CustomDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("intro");

  const handleStart = () => {
    const inputElement = document.getElementById(
      "example"
    ) as HTMLInputElement | null;
    if (inputElement) {
      const s = inputElement.value;
      if (s === "Death Note") {
        onClose();
      } else {
        // Question Generation Functionality
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[455px]">
        <DialogHeader>
          <Tabs
            defaultValue="intro"
            className="w-[400px]"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="intro">Introduction</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="intro">
              <Card>
                <CardHeader>
                  <CardTitle>DSA practice platform</CardTitle>
                  <CardDescription>
                    What makes this interesting is that there are extremely fun
                    😎, relatable, fictional practice problems
                  </CardDescription>
                  <CardDescription>
                    There are unlimited Questions to practice from 🗿. Try to
                    solve them authentically
                  </CardDescription>
                  <CardDescription>
                    You can practice with friends, or alone.
                  </CardDescription>
                  <CardDescription>
                    Our system 🤖 gives you suggestions on your submitted code,
                    and how you can make it better
                  </CardDescription>
                  <CardDescription>
                    Let me give you an example of how cool it can get. Type any
                    anime name you like, for example, "Death Note".
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="anime">Anime name</Label>
                    <Input id="example" defaultValue="Death Note" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleStart}>Start</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Log In / Create Account</CardTitle>
                  <CardDescription>
                    Login or Register here. Click "Create/Login" when you're
                    done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Username</Label>
                    <Input id="uname" type="name" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">Password</Label>
                    <Input id="pass" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Create/Login</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          {activeTab !== "intro" && (
            <Button onClick={onClose}>Register Later</Button>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
