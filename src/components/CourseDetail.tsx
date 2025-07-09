
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, Trophy, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { Course, Lesson, CourseService } from '@/services/CourseService';
import { AudioService } from '@/services/AudioService';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onLessonComplete: (courseId: string, lessonId: string) => void;
  selectedLanguage?: string;
}

const CourseDetail = ({ course, onBack, onLessonComplete, selectedLanguage = 'English' }: CourseDetailProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioService = new AudioService();

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleCompleteLesson = (lesson: Lesson) => {
    if (!lesson.completed) {
      onLessonComplete(course.id, lesson.id);
      toast.success(`Lesson "${lesson.title}" completed! +50 points`);
      setSelectedLesson({ ...lesson, completed: true });
    }
  };

  const handlePlayAudio = async (lessonId: string) => {
    if (!audioService.isSupported()) {
      toast.error('Audio is not supported in this browser');
      return;
    }

    setIsPlayingAudio(true);
    
    try {
      const audioExplanation = audioService.getAudioExplanation(lessonId, selectedLanguage);
      await audioService.speakText(audioExplanation, selectedLanguage);
      toast.success('Audio explanation completed');
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio explanation');
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedLesson(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {selectedLesson.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{selectedLesson.duration} min</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Lesson Content</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlayAudio(selectedLesson.id)}
                      disabled={isPlayingAudio}
                      className="flex items-center space-x-2"
                    >
                      {isPlayingAudio ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Playing...</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Listen in {selectedLanguage}</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedLesson.content}</p>
                </div>

                <div className="flex justify-between items-center">
                  {selectedLesson.completed ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Completed</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleCompleteLesson(selectedLesson)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 ${course.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                  {course.icon}
                </div>
                <div>
                  <CardTitle className="text-2xl">{course.name}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {course.description}
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Lessons</h3>
          {course.lessons.map((lesson, index) => (
            <Card 
              key={lesson.id} 
              className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleLessonClick(lesson)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-blue-600">
                          <Volume2 className="w-3 h-3" />
                          <span>Audio available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {lesson.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Play className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
