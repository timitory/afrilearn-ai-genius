
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, User, Settings, Bell, HelpCircle, LogOut, Star, Trophy, Book, Calendar, Globe, Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import BottomNavigation from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { CourseService } from '@/services/CourseService';
import { toast } from 'sonner';

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const navigate = useNavigate();
  const userProgress = CourseService.getUserProgress();

  const achievements = [
    { name: 'First Steps', icon: '🎯', earned: true, date: '2024-01-15' },
    { name: 'Quick Learner', icon: '⚡', earned: true, date: '2024-01-20' },
    { name: 'Streak Master', icon: '🔥', earned: userProgress?.currentStreak >= 7, date: '2024-01-25' },
    { name: 'Challenge Champion', icon: '👑', earned: userProgress?.totalLessonsCompleted >= 20, date: '2024-02-01' }
  ];

  const recentActivity = [
    { type: 'lesson', title: 'Completed "Linear Equations"', subject: 'Mathematics', date: '2 hours ago' },
    { type: 'achievement', title: 'Earned "Quick Learner" badge', subject: 'Achievement', date: '1 day ago' },
    { type: 'challenge', title: 'Joined "Math Marathon" challenge', subject: 'Challenge', date: '2 days ago' },
    { type: 'lesson', title: 'Started "Atomic Structure"', subject: 'Chemistry', date: '3 days ago' }
  ];

  const handleLogout = () => {
    toast.success('Logged out successfully');
    // In a real app, this would clear authentication state
    navigate('/');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚';
      case 'achievement': return '🏆';
      case 'challenge': return '🎯';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="font-bold text-xl text-gray-900">Profile</h2>
              <p className="text-sm text-gray-500">Manage your account</p>
            </div>
          </div>
          <Settings className="w-6 h-6 text-gray-500" />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Profile Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                👩‍🎓
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">Kemi</h3>
                <p className="text-purple-100 mb-2">SS2 Student • Level 8</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{userProgress?.points || 0} points</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>#{userProgress?.classRank || 3} in class</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Book className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{userProgress?.totalLessonsCompleted || 0}</p>
              <p className="text-sm text-gray-500">Lessons Completed</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{userProgress?.currentStreak || 0}</p>
              <p className="text-sm text-gray-500">Day Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <Card key={index} className={`border-0 shadow-md text-center ${achievement.earned ? 'bg-gradient-to-r from-yellow-100 to-orange-100' : 'bg-gray-50'}`}>
                <CardContent className="p-4">
                  <div className={`text-3xl mb-2 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <p className={`font-semibold text-sm ${achievement.earned ? 'text-orange-700' : 'text-gray-500'}`}>
                    {achievement.name}
                  </p>
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Settings</h3>
          <div className="space-y-3">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-gray-500">Get updates about your progress</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications} 
                    onCheckedChange={setNotifications}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {darkMode ? <Moon className="w-5 h-5 text-gray-500" /> : <Sun className="w-5 h-5 text-gray-500" />}
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-500">Toggle dark theme</p>
                    </div>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-gray-500">English</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">{activity.subject}</p>
                        <p className="text-xs text-gray-400">{activity.date}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" size="lg">
            <HelpCircle className="w-5 h-5 mr-3" />
            Help & Support
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" 
            size="lg"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      <BottomNavigation currentRoute="/profile" />
    </div>
  );
};

export default Profile;
