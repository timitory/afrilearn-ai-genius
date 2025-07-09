
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, GraduationCap, TrendingUp, MapPin, Clock, DollarSign, Star } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';

const careerPaths = [
  {
    id: '1',
    title: 'Software Engineer',
    description: 'Build applications and systems using programming languages',
    salary: '₦3,500,000 - ₦8,000,000',
    growth: 'High',
    skills: ['Python', 'JavaScript', 'React', 'Node.js'],
    education: 'Bachelor\'s in Computer Science',
    icon: '💻',
    color: 'bg-blue-500',
    demand: 'Very High'
  },
  {
    id: '2',
    title: 'Data Scientist',
    description: 'Analyze complex data to help organizations make decisions',
    salary: '₦2,800,000 - ₦7,500,000',
    growth: 'Very High',
    skills: ['Python', 'R', 'SQL', 'Machine Learning'],
    education: 'Bachelor\'s in Statistics/Math',
    icon: '📊',
    color: 'bg-green-500',
    demand: 'High'
  },
  {
    id: '3',
    title: 'Biomedical Engineer',
    description: 'Design medical equipment and devices to improve healthcare',
    salary: '₦2,000,000 - ₦5,500,000',
    growth: 'High',
    skills: ['Biology', 'Engineering', 'CAD', 'Materials Science'],
    education: 'Bachelor\'s in Biomedical Engineering',
    icon: '🏥',
    color: 'bg-red-500',
    demand: 'Medium'
  },
  {
    id: '4',
    title: 'Environmental Engineer',
    description: 'Develop solutions to environmental problems',
    salary: '₦1,800,000 - ₦4,500,000',
    growth: 'Medium',
    skills: ['Chemistry', 'Environmental Science', 'Project Management'],
    education: 'Bachelor\'s in Environmental Engineering',
    icon: '🌱',
    color: 'bg-green-600',
    demand: 'Medium'
  }
];

const universities = [
  {
    id: '1',
    name: 'University of Lagos',
    location: 'Lagos, Nigeria',
    programs: ['Computer Science', 'Engineering', 'Mathematics'],
    ranking: '#1 in Nigeria',
    logo: '🏛️'
  },
  {
    id: '2',
    name: 'Obafemi Awolowo University',
    location: 'Ile-Ife, Nigeria',
    programs: ['Physics', 'Chemistry', 'Biology'],
    ranking: '#2 in Nigeria',
    logo: '🎓'
  },
  {
    id: '3',
    name: 'University of Ibadan',
    location: 'Ibadan, Nigeria',
    programs: ['Medicine', 'Engineering', 'Sciences'],
    ranking: '#3 in Nigeria',
    logo: '📚'
  }
];

const Career = () => {
  const [selectedTab, setSelectedTab] = useState('careers');
  const navigate = useNavigate();

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High': return 'bg-green-100 text-green-700';
      case 'High': return 'bg-blue-100 text-blue-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'Very High': return 'bg-green-100 text-green-700';
      case 'High': return 'bg-blue-100 text-blue-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
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
              <h2 className="font-bold text-xl text-gray-900">Career Hub</h2>
              <p className="text-sm text-gray-500">Explore STEM career paths</p>
            </div>
          </div>
          <Briefcase className="w-6 h-6 text-gray-500" />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {['careers', 'education', 'skills'].map((tab) => (
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

        {/* Career Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Briefcase className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">50+</p>
              <p className="text-xs text-gray-500">Career Paths</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">85%</p>
              <p className="text-xs text-gray-500">Job Growth</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <DollarSign className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">₦5M</p>
              <p className="text-xs text-gray-500">Avg Salary</p>
            </CardContent>
          </Card>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === 'careers' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Popular STEM Careers</h3>
            {careerPaths.map((career) => (
              <Card key={career.id} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${career.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {career.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{career.title}</h4>
                        <Badge className={getDemandColor(career.demand)}>{career.demand} Demand</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{career.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Salary Range</p>
                          <p className="font-medium text-sm">{career.salary}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Growth Rate</p>
                          <Badge className={getGrowthColor(career.growth)} variant="secondary">
                            {career.growth}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {career.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Education</p>
                        <p className="text-sm font-medium">{career.education}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'education' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Top Universities in Nigeria</h3>
            {universities.map((university) => (
              <Card key={university.id} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{university.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{university.name}</h4>
                        <Badge className="bg-blue-100 text-blue-700">{university.ranking}</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-1 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">{university.location}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-2">STEM Programs</p>
                        <div className="flex flex-wrap gap-1">
                          {university.programs.map((program, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {program}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'skills' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">In-Demand STEM Skills</h3>
            
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Technical Skills</CardTitle>
                <CardDescription>Core technical competencies for STEM careers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { skill: 'Programming (Python, Java, C++)', demand: 95 },
                  { skill: 'Data Analysis & Statistics', demand: 88 },
                  { skill: 'Machine Learning & AI', demand: 92 },
                  { skill: 'Cloud Computing (AWS, Azure)', demand: 85 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.skill}</span>
                      <span className="text-sm text-gray-500">{item.demand}% demand</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${item.demand}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Soft Skills</CardTitle>
                <CardDescription>Essential interpersonal skills for career success</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { skill: 'Problem Solving', demand: 98 },
                  { skill: 'Critical Thinking', demand: 94 },
                  { skill: 'Communication', demand: 91 },
                  { skill: 'Teamwork & Collaboration', demand: 89 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.skill}</span>
                      <span className="text-sm text-gray-500">{item.demand}% importance</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${item.demand}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <BottomNavigation currentRoute="/career" />
    </div>
  );
};

export default Career;
