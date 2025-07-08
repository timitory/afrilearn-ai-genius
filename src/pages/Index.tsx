
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Book, Trophy, Users, Globe } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [currentUser, setCurrentUser] = useState(null);

  const languages = ['English', 'Yoruba', 'Igbo', 'Hausa'];
  
  const stemSubjects = [
    { name: 'Mathematics', icon: '📊', color: 'bg-blue-500', lessons: 45 },
    { name: 'Physics', icon: '⚡', color: 'bg-purple-500', lessons: 38 },
    { name: 'Chemistry', icon: '🧪', color: 'bg-green-500', lessons: 42 },
    { name: 'Biology', icon: '🧬', color: 'bg-red-500', lessons: 36 },
    { name: 'Coding', icon: '💻', color: 'bg-orange-500', lessons: 28 }
  ];

  const achievements = [
    { name: 'First Steps', icon: '🎯', earned: true },
    { name: 'Quick Learner', icon: '⚡', earned: true },
    { name: 'Streak Master', icon: '🔥', earned: false },
    { name: 'Challenge Champion', icon: '👑', earned: false }
  ];

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Voice activated! Ask me any STEM question.');
    } else {
      toast.info('Voice deactivated.');
    }
  };

  const handleLogin = () => {
    setCurrentUser({ name: 'Kemi', level: 'SS2', points: 1250 });
    toast.success('Welcome back, Kemi!');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-3xl">
              🧠
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              STEM Learn AI
            </CardTitle>
            <CardDescription className="text-base">
              Your AI-powered STEM tutor for African students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Choose your language</label>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage(lang)}
                    className={selectedLanguage === lang ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3"
            >
              Start Learning
            </Button>
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">New to STEM Learn AI?</p>
              <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
              {currentUser.name[0]}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{currentUser.name}</h2>
              <p className="text-sm text-gray-500">{currentUser.level} • {currentUser.points} points</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">{selectedLanguage}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Voice Tutor Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="w-6 h-6" />
              <span>AI Voice Tutor</span>
            </CardTitle>
            <CardDescription className="text-purple-100">
              Ask any STEM question using your voice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={toggleVoice}
                size="lg"
                className={`rounded-full w-16 h-16 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-white text-purple-500 hover:bg-gray-100'
                }`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </Button>
              <div className="text-center">
                <p className="font-semibold">
                  {isListening ? 'Listening...' : 'Tap to ask a question'}
                </p>
                <p className="text-sm text-purple-100">
                  {isListening ? 'Speak now in ' + selectedLanguage : 'Voice in ' + selectedLanguage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STEM Subjects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">STEM Subjects</h3>
            <Button variant="ghost" size="sm" className="text-orange-600">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {stemSubjects.map((subject, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {subject.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                      <p className="text-sm text-gray-500">{subject.lessons} lessons available</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Available Offline
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Book className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-500">Lessons Completed</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">7</p>
              <p className="text-sm text-gray-500">Day Streak</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">3rd</p>
              <p className="text-sm text-gray-500">Class Rank</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <Card key={index} className={`border-0 shadow-md text-center ${achievement.earned ? 'bg-gradient-to-r from-yellow-100 to-orange-100' : 'bg-gray-50'}`}>
                <CardContent className="p-4">
                  <div className={`text-3xl mb-2 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <p className={`font-semibold ${achievement.earned ? 'text-orange-700' : 'text-gray-500'}`}>
                    {achievement.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Placeholder */}
        <div className="h-20"></div>
      </div>
      
      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-5 gap-1 p-2">
          {[
            { icon: '🏠', label: 'Home', active: true },
            { icon: '📚', label: 'Courses', active: false },
            { icon: '🏆', label: 'Challenges', active: false },
            { icon: '💼', label: 'Career', active: false },
            { icon: '👤', label: 'Profile', active: false }
          ].map((tab, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`flex flex-col items-center space-y-1 h-auto py-2 ${
                tab.active ? 'text-orange-600' : 'text-gray-500'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
