import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { setSession } from '@/lib/session';

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

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState<'error' | 'success' | null>(null);

  const clearMessage = () => {
    setMessage('');
    setErrorType(null);
  };

  const handleSubmit = async () => {
    // Reset previous messages
    setMessage('');
    setErrorType(null);
    setIsLoading(true);

    // Basic validation
    if (!username.trim()) {
      setMessage('Username is required');
      setErrorType('error');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setMessage('Password is required');
      setErrorType('error');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
      
      if (res.ok) {
        // Store session data using utility function
        setSession(username, data.token || 'dummy-token');
        
        if (res.status === 201) {
          // New user created
          setMessage('Account created successfully! Welcome to Code Sensei!');
          setErrorType('success');
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          // Existing user logged in
          setMessage('Login successful! Welcome back!');
          setErrorType('success');
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else {
        // Handle different error cases
        if (res.status === 401) {
          setMessage('Invalid username or password. Please try again.');
          setErrorType('error');
        } else if (res.status === 500) {
          setMessage('Server error. Please try again later.');
          setErrorType('error');
        } else {
          setMessage(data.message || 'An error occurred. Please try again.');
          setErrorType('error');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please check your connection and try again.');
      setErrorType('error');
    } finally {
      setIsLoading(false);
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
                    anime name you like, for example, &quot;Death Note&quot;.
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
                  Login or Register here. Click &quot;Create/Login&quot; when you&apos;re
                  done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="uname">Username</Label>
                    <Input 
                      id="uname" 
                      value={username} 
                      onChange={(e) => {
                        setUsername(e.target.value);
                        clearMessage();
                      }} 
                      type="text"
                      className={errorType === 'error' ? 'border-red-500 focus:border-red-500' : ''}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pass">Password</Label>
                    <Input 
                      id="pass" 
                      type="password" 
                      value={password} 
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearMessage();
                      }}
                      className={errorType === 'error' ? 'border-red-500 focus:border-red-500' : ''}
                      disabled={isLoading}
                    />
                  </div>
                  
                  {/* Validation Message */}
                  {message && (
                    <div className={`p-3 rounded-md text-sm font-medium ${
                      errorType === 'error' 
                        ? 'bg-red-50 border border-red-200 text-red-800' 
                        : 'bg-green-50 border border-green-200 text-green-800'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {errorType === 'error' ? (
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span>{message}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Create/Login'
                    )}
                  </Button>
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
