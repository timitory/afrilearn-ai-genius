import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile, AuthService } from '@/services/AuthService';
import AuthContainer from '@/components/auth/AuthContainer';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Volume2, Book, Trophy, Users, Globe, MessageSquare, Star, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useVoiceTutor } from '@/hooks/useVoiceTutor';
import { CourseService, Course, UserProgress } from '@/services/CourseService';
import CourseDetail from '@/components/CourseDetail';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const {
    isListening,
    isProcessing,
    currentQuestion,
    currentAnswer,
    conversationHistory,
    startListening,
    stopListening,
    speakAnswer,
    isSupported
  } = useVoiceTutor(selectedLanguage);

  const languages = ['English', 'Yoruba', 'Igbo', 'Hausa'];

  useEffect(() => {
    if (currentUser) {
      setCourses(CourseService.getCourses());
      setUserProgress(CourseService.getUserProgress());
    }
  }, [currentUser]);

  const achievements = [
    { name: 'First Steps', icon: '🎯', earned: true },
    { name: 'Quick Learner', icon: '⚡', earned: true },
    { name: 'Streak Master', icon: '🔥', earned: userProgress?.currentStreak >= 7 },
    { name: 'Challenge Champion', icon: '👑', earned: userProgress?.totalLessonsCompleted >= 20 }
  ];

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
      toast.info('Voice deactivated.');
    } else {
      if (!isSupported) {
        toast.error('Speech recognition is not supported in this browser');
        return;
      }
      startListening();
      toast.success('Voice activated! Ask me any STEM question.');
    }
  };

  const handleAuthSuccess = (authUser: User, profile: UserProfile) => {
    setUser(authUser);
    setUserProfile(profile);
    
    if (profile.role === 'student') {
      setCourses(CourseService.getCourses());
      setUserProgress(CourseService.getUserProgress());
    }
  };

  const handleSignOut = async () => {
    await AuthService.signOut();
    setUser(null);
    setUserProfile(null);
    setCourses([]);
    setUserProgress(null);
  };

  const handleLogin = () => {
    setCurrentUser({ name: 'Kemi', level: 'SS2', points: 1250 });
    toast.success('Welcome back, Kemi!');
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleLessonComplete = (courseId: string, lessonId: string) => {
    CourseService.completeLesson(courseId, lessonId);
    setCourses(CourseService.getCourses());
    setUserProgress(CourseService.getUserProgress());
  };

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onLessonComplete={handleLessonComplete}
        selectedLanguage={selectedLanguage}
      />
    );
  }

  if (!user || !userProfile) {
    return <AuthContainer onAuthSuccess={handleAuthSuccess} />;
  }

  if (userProfile.role === 'admin') {
    return <AdminDashboard profile={userProfile} onSignOut={handleSignOut} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
              {userProfile.full_name[0]}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{userProfile.full_name}</h2>
              <p className="text-sm text-gray-500">{userProfile.institution_name} • {userProgress?.points || 0} points</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">#{userProgress?.classRank || 3}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">{selectedLanguage}</span>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
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
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Button
                onClick={toggleVoice}
                size="lg"
                disabled={isProcessing || !isSupported}
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
                  {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Tap to ask a question'}
                </p>
                <p className="text-sm text-purple-100">
                  {isProcessing ? 'Thinking about your question' : isListening ? 'Speak now in ' + selectedLanguage : 'Voice in ' + selectedLanguage}
                </p>
              </div>
            </div>

            {/* Current Q&A Display */}
            {(currentQuestion || currentAnswer) && (
              <div className="space-y-3 bg-white/10 rounded-lg p-4">
                {currentQuestion && (
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 mt-1 text-purple-200" />
                    <div>
                      <p className="text-sm text-purple-100">Your Question:</p>
                      <p className="font-medium">{currentQuestion}</p>
                    </div>
                  </div>
                )}
                {currentAnswer && (
                  <div className="flex items-start space-x-2">
                    <div className="w-4 h-4 mt-1 bg-purple-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-purple-100">AI Tutor Response:</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => speakAnswer(currentAnswer)}
                          className="text-white hover:bg-white/20 h-auto py-1 px-2"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm leading-relaxed">{currentAnswer}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isSupported && (
              <div className="text-center text-purple-100 text-sm">
                Speech recognition is not supported in this browser
              </div>
            )}
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
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCourseClick(course)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${course.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {course.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{course.name}</h4>
                      <p className="text-sm text-gray-500">{course.totalLessons} lessons • {course.difficulty}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{course.completedLessons}/{course.totalLessons} completed</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 mb-2">
                        Available Offline
                      </Badge>
                      {course.completedLessons > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-orange-600">
                          <Award className="w-3 h-3" />
                          <span>In Progress</span>
                        </div>
                      )}
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
              <p className="text-2xl font-bold text-gray-900">{userProgress?.totalLessonsCompleted || 0}</p>
              <p className="text-sm text-gray-500">Lessons Completed</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{userProgress?.currentStreak || 0}</p>
              <p className="text-sm text-gray-500">Day Streak</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{userProgress?.classRank || 3}rd</p>
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
                  {achievement.earned && (
                    <Badge className="mt-2 bg-green-500 text-white">Earned</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Questions</h3>
            <div className="space-y-3">
              {conversationHistory.slice(-3).reverse().map((conversation, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 mt-1 text-gray-400" />
                        <p className="text-sm text-gray-600">Q: {conversation.question}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-4 h-4 mt-1 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-900 leading-relaxed">A: {conversation.answer}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => speakAnswer(conversation.answer)}
                              className="text-gray-500 hover:text-gray-700 h-auto py-1 px-2"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation Placeholder */}
        <div className="h-20"></div>
      </div>
      
      {/* Fixed Bottom Navigation */}
      <BottomNavigation currentRoute="/" />
    </div>
  );
};

export default Index;
