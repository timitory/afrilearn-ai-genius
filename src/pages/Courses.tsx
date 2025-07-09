
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Book, Trophy, Users, Globe, Award, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CourseService, Course } from '@/services/CourseService';
import CourseDetail from '@/components/CourseDetail';
import BottomNavigation from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const navigate = useNavigate();

  useEffect(() => {
    setCourses(CourseService.getCourses());
  }, []);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleLessonComplete = (courseId: string, lessonId: string) => {
    CourseService.completeLesson(courseId, lessonId);
    setCourses(CourseService.getCourses());
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onLessonComplete={handleLessonComplete}
      />
    );
  }

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

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
              <h2 className="font-bold text-xl text-gray-900">All Courses</h2>
              <p className="text-sm text-gray-500">{courses.length} STEM subjects available</p>
            </div>
          </div>
          <Globe className="w-6 h-6 text-gray-500" />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`whitespace-nowrap ${
                  selectedDifficulty === difficulty ? "bg-orange-500 hover:bg-orange-600" : ""
                }`}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Book className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">{courses.length}</p>
              <p className="text-xs text-gray-500">Total Courses</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">{courses.filter(c => c.completedLessons > 0).length}</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Award className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">{courses.filter(c => c.progress === 100).length}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id} 
              className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 ${course.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                    {course.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{course.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">{course.description}</p>
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant="secondary" className={`
                        ${course.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 
                          course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'}
                      `}>
                        {course.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {course.totalLessons} lessons
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{course.completedLessons}/{course.totalLessons} completed</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <BottomNavigation currentRoute="/courses" />
    </div>
  );
};

export default Courses;
