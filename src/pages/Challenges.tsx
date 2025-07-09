
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Clock, Users, Star, Zap, Target, Crown, Medal } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const challenges = [
  {
    id: '1',
    title: 'Math Marathon',
    description: 'Complete 10 math lessons in 5 days',
    type: 'Weekly',
    progress: 60,
    reward: 500,
    difficulty: 'Medium',
    timeLeft: '3 days',
    participants: 234,
    icon: '📊',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Physics Master',
    description: 'Score 90% or higher on 5 physics quizzes',
    type: 'Monthly',
    progress: 40,
    reward: 1000,
    difficulty: 'Hard',
    timeLeft: '12 days',
    participants: 156,
    icon: '⚡',
    color: 'bg-purple-500'
  },
  {
    id: '3',
    title: 'Chemistry Streak',
    description: 'Study chemistry for 7 consecutive days',
    type: 'Daily',
    progress: 85,
    reward: 300,
    difficulty: 'Easy',
    timeLeft: '2 days',
    participants: 445,
    icon: '🧪',
    color: 'bg-green-500'
  },
  {
    id: '4',
    title: 'Code Quest',
    description: 'Complete your first programming project',
    type: 'Special',
    progress: 25,
    reward: 750,
    difficulty: 'Medium',
    timeLeft: '10 days',
    participants: 89,
    icon: '💻',
    color: 'bg-orange-500'
  }
];

const leaderboard = [
  { rank: 1, name: 'Adebayo', points: 2450, avatar: '👨‍🎓' },
  { rank: 2, name: 'Chinwe', points: 2320, avatar: '👩‍🎓' },
  { rank: 3, name: 'Kemi', points: 1250, avatar: '👩‍🎓' },
  { rank: 4, name: 'Ibrahim', points: 1180, avatar: '👨‍🎓' },
  { rank: 5, name: 'Folake', points: 1050, avatar: '👩‍🎓' }
];

const Challenges = () => {
  const [selectedTab, setSelectedTab] = useState('active');
  const navigate = useNavigate();

  const handleJoinChallenge = (challengeId: string) => {
    toast.success('Challenge joined! Good luck!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Daily': return 'bg-blue-100 text-blue-700';
      case 'Weekly': return 'bg-purple-100 text-purple-700';
      case 'Monthly': return 'bg-orange-100 text-orange-700';
      case 'Special': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
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
              <h2 className="font-bold text-xl text-gray-900">Challenges</h2>
              <p className="text-sm text-gray-500">Test your STEM knowledge</p>
            </div>
          </div>
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {['active', 'completed', 'leaderboard'].map((tab) => (
            <Button
              key={tab}
              variant={selectedTab === tab ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 capitalize ${
                selectedTab === tab ? "bg-white shadow-sm" : ""
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">4</p>
              <p className="text-xs text-gray-500">Active</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Medal className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">12</p>
              <p className="text-xs text-gray-500">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Crown className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">3rd</p>
              <p className="text-xs text-gray-500">Rank</p>
            </CardContent>
          </Card>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === 'active' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Active Challenges</h3>
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${challenge.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {challenge.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                        <div className="flex items-center space-x-1">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-yellow-600">{challenge.reward}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={getTypeColor(challenge.type)}>{challenge.type}</Badge>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{challenge.timeLeft}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{challenge.participants}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinChallenge(challenge.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'completed' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Completed Challenges</h3>
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed challenges yet</h3>
              <p className="text-gray-500">Complete your first challenge to see it here!</p>
            </div>
          </div>
        )}

        {selectedTab === 'leaderboard' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Leaderboard</h3>
            <div className="space-y-3">
              {leaderboard.map((player) => (
                <Card key={player.rank} className={`border-0 shadow-md ${player.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          player.rank === 1 ? 'bg-yellow-500' :
                          player.rank === 2 ? 'bg-gray-400' :
                          player.rank === 3 ? 'bg-orange-500' : 'bg-gray-300'
                        }`}>
                          {player.rank}
                        </div>
                        <span className="text-2xl">{player.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{player.name}</h4>
                        <p className="text-sm text-gray-500">{player.points} points</p>
                      </div>
                      {player.rank <= 3 && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation currentRoute="/challenges" />
    </div>
  );
};

export default Challenges;
