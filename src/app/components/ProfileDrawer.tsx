"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User, Settings, Trophy, Clock, Target, BarChart3 } from 'lucide-react';
import { getSession, clearSession } from '@/lib/session';

interface UserProfile {
  username: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalQuestions: number;
  solvedQuestions: number;
  streak: number;
  averageTime: number;
  weakTopics: string[];
  strongTopics: string[];
  joinDate: string;
}

const ProfileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get user data from session or use defaults
  const getStoredUserData = (): UserProfile => {
    const session = getSession();
    
    return {
      username: session.username || 'CodeMaster',
      level: "intermediate",
      totalQuestions: 45,
      solvedQuestions: 32,
      streak: 7,
      averageTime: 12.5,
      weakTopics: ["Dynamic Programming", "Graphs"],
      strongTopics: ["Arrays", "Strings", "Sorting"],
      joinDate: session.loginTime ? new Date(session.loginTime).toISOString().split('T')[0] : "2024-01-15"
    };
  };

  const userProfile = getStoredUserData();

  const handleLogout = () => {
    // Clear session data using utility function
    clearSession();
    
    // Close the drawer
    setIsOpen(false);
    
    // Reload the page to show login modal
    window.location.reload();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return '🟢';
      case 'intermediate': return '🟡';
      case 'advanced': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="relative h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105"
        >
          <User className="h-4 w-4 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
        <div className="flex flex-col h-full">
          <SheetHeader className="text-center pb-4 border-b">
            <div className="flex items-center justify-center space-x-3">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                {userProfile.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <SheetTitle className="text-2xl font-bold">{userProfile.username}</SheetTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getLevelIcon(userProfile.level)}</span>
                  <span className={`text-lg font-semibold ${getLevelColor(userProfile.level)}`}>
                    {userProfile.level.charAt(0).toUpperCase() + userProfile.level.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Total Questions</span>
                </div>
                <p className="text-2xl font-bold text-blue-900 mt-1">{userProfile.totalQuestions}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Solved</span>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-1">{userProfile.solvedQuestions}</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Streak</span>
                </div>
                <p className="text-2xl font-bold text-orange-900 mt-1">{userProfile.streak} days</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Avg Time</span>
                </div>
                <p className="text-2xl font-bold text-purple-900 mt-1">{userProfile.averageTime}m</p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Progress Overview</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                  <span className="text-sm font-bold text-gray-900">
                    {Math.round((userProfile.solvedQuestions / userProfile.totalQuestions) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(userProfile.solvedQuestions / userProfile.totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Topics Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Topic Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    Strong Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.strongTopics.map((topic, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-xl">
                  <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    Weak Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.weakTopics.map((topic, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-red-200 text-red-800 text-xs rounded-full font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Member since</span>
                <span className="text-sm font-bold text-gray-900">
                  {new Date(userProfile.joinDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button 
              variant="outline"
              className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileDrawer;
