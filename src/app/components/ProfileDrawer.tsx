"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User, Settings, Trophy, Clock, Target, BarChart3, Loader2, Bookmark, Upload, Camera, X, Calendar, TrendingUp, Award, Zap } from 'lucide-react';
import { getSession, clearSession, isSessionValid } from '@/lib/session';
import { toast } from 'sonner';
import Image from 'next/image';

interface UserProfile {
  username: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalQuestions: number;
  solvedQuestions: number;
  savedQuestions: number;
  streak: number;
  averageTime: number;
  weakTopics: string[];
  strongTopics: string[];
  joinDate: string;
  interests: string[];
  preferredLanguages: string[];
  completionRate: number;
  recentActivity: Array<{
    date: string;
    questionsSolved: number;
  }>;
  lastActive: string;
  imageUrl?: string;
}

const ProfileDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Check authentication status
  useEffect(() => {
    setIsAuthenticated(isSessionValid());
  }, []);

  // Fetch user profile when drawer opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchUserProfile();
    }
  }, [isOpen, isAuthenticated]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user-profile');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        console.error('Failed to fetch user profile');
        toast.error('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Error loading profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(prev => prev ? { ...prev, imageUrl: data.imageUrl } : null);
        setShowImageUpload(false);
        toast.success('Profile image updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    setIsUploading(true);
    try {
      const response = await fetch('/api/upload-profile-image', {
        method: 'DELETE',
      });

      if (response.ok) {
        setUserProfile(prev => prev ? { ...prev, imageUrl: undefined } : null);
        toast.success('Profile image removed successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to remove image');
      }
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
    setUserProfile(null);
    setIsOpen(false);
    toast.success('Logged out successfully');
    
    // Reload the page to show login modal
    window.location.reload();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-emerald-400 bg-emerald-400/10';
      case 'intermediate': return 'text-amber-400 bg-amber-400/10';
      case 'advanced': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return <Zap className="w-4 h-4" />;
      case 'intermediate': return <Target className="w-4 h-4" />;
      case 'advanced': return <Award className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  // Default profile for non-authenticated users
  const displayProfile: UserProfile = userProfile || {
    username: 'Guest User',
    level: 'beginner',
    totalQuestions: 0,
    solvedQuestions: 0,
    savedQuestions: 0,
    streak: 0,
    averageTime: 0,
    weakTopics: [],
    strongTopics: [],
    joinDate: new Date().toISOString(),
    interests: [],
    preferredLanguages: ['javascript'],
    completionRate: 0,
    recentActivity: [],
    lastActive: new Date().toISOString(),
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="relative h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <User className="h-5 w-5 text-white" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full max-w-none bg-gradient-to-br from-slate-900 via-gray-900 to-black border-l border-gray-700/50 overflow-y-auto p-0">
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border-b border-gray-700/50 p-8">
            <div className="flex items-center space-x-6">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white overflow-hidden shadow-2xl ring-4 ring-white/10">
                  {displayProfile.imageUrl ? (
                    <Image 
                      src={displayProfile.imageUrl} 
                      alt="Profile" 
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    displayProfile.username.charAt(0).toUpperCase()
                  )}
                </div>
                
                {/* Upload/Edit overlay */}
                {isAuthenticated && (
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    <div className="flex space-x-2">
                      {displayProfile.imageUrl ? (
                        <>
                          <button 
                            onClick={() => setShowImageUpload(true)} 
                            className="p-2 bg-blue-600/90 rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 shadow-lg"
                            title="Change image"
                          >
                            <Camera className="w-4 h-4 text-white" />
                          </button>
                          <button 
                            onClick={handleRemoveImage} 
                            disabled={isUploading}
                            className="p-2 bg-red-600/90 rounded-xl hover:bg-red-700 transition-all duration-200 hover:scale-110 shadow-lg disabled:opacity-50"
                            title="Remove image"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => setShowImageUpload(true)} 
                          className="p-2 bg-blue-600/90 rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 shadow-lg"
                          title="Upload image"
                        >
                          <Upload className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{displayProfile.username}</h2>
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${getLevelColor(displayProfile.level)}`}>
                    {getLevelIcon(displayProfile.level)}
                    <span>{displayProfile.level.charAt(0).toUpperCase() + displayProfile.level.slice(1)}</span>
                  </span>
                  <span className="text-gray-400 text-sm flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(displayProfile.joinDate).toLocaleDateString()}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span>{displayProfile.solvedQuestions} Solved</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bookmark className="w-4 h-4 text-blue-500" />
                    <span>{displayProfile.savedQuestions} Saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          {showImageUpload && isAuthenticated && (
            <div className="p-6 bg-gray-800/50 border-b border-gray-700/50">
              <div className="max-w-md mx-auto">
                <div className="text-center p-6 bg-gray-50/10 rounded-2xl border-2 border-dashed border-gray-600/50 backdrop-blur-sm">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-4 font-medium">Upload a new profile image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="profile-image-upload"
                  />
                  <label
                    htmlFor="profile-image-upload"
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </>
                    )}
                  </label>
                  <button 
                    onClick={() => setShowImageUpload(false)} 
                    className="ml-3 px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">Supported formats: JPEG, PNG, GIF, WebP (max 5MB)</p>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Trophy className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{displayProfile.solvedQuestions}</p>
                        <p className="text-sm text-gray-400">Questions Solved</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <Zap className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{displayProfile.streak}</p>
                        <p className="text-sm text-gray-400">Day Streak</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{displayProfile.completionRate}%</p>
                        <p className="text-sm text-gray-400">Completion Rate</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-orange-500/20 rounded-xl">
                        <Clock className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{Math.round(displayProfile.averageTime / 60)}m</p>
                        <p className="text-sm text-gray-400">Avg. Time</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills & Interests */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span>Skills & Interests</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strong Topics */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                      <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Strong Topics</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {displayProfile.strongTopics.length > 0 ? (
                          displayProfile.strongTopics.map((topic, index) => (
                            <span key={index} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                              {topic}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No strong topics yet</span>
                        )}
                      </div>
                    </div>

                    {/* Weak Topics */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                      <h4 className="text-lg font-semibold text-orange-400 mb-3 flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Areas to Improve</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {displayProfile.weakTopics.length > 0 ? (
                          displayProfile.weakTopics.map((topic, index) => (
                            <span key={index} className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                              {topic}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Keep practicing!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preferred Languages */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Preferred Languages</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {displayProfile.preferredLanguages.map((lang, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                {displayProfile.recentActivity.length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <span>Recent Activity</span>
                    </h3>
                    <div className="space-y-3">
                      {displayProfile.recentActivity.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                          <span className="text-gray-300">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                          <span className="text-white font-semibold">
                            {activity.questionsSolved} questions solved
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  {isAuthenticated ? (
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="flex-1 bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        // Trigger login modal
                        window.location.reload();
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Login to View Profile
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileDrawer;