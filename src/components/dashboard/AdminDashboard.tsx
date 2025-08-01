
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, School, BookOpen, Trophy, Copy, Check, Plus } from 'lucide-react';
import { UserProfile } from '@/services/AuthService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminDashboardProps {
  profile: UserProfile;
  onSignOut: () => void;
}

interface InstitutionStats {
  totalStudents: number;
  activeStudents: number;
  completedLessons: number;
  institutionCode: string;
  institutionName: string;
}

interface Student {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

const AdminDashboard = ({ profile, onSignOut }: AdminDashboardProps) => {
  const [stats, setStats] = useState<InstitutionStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showCreateInstitution, setShowCreateInstitution] = useState(false);
  const [institutionName, setInstitutionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (profile.institution_id) {
      fetchInstitutionData();
    } else {
      console.log('Admin has no institution, showing create form');
      setShowCreateInstitution(true);
    }
  }, [profile.institution_id]);

  const createInstitution = async () => {
    if (!institutionName.trim()) {
      toast.error('Please enter an institution name');
      return;
    }

    setIsCreating(true);
    try {
      // Generate a unique code for the institution
      const institutionCode = institutionName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 4) + Math.random().toString(36).substring(2, 6).toUpperCase();

      console.log('Creating institution:', institutionName, 'with code:', institutionCode);

      const { data: institutionResult, error: institutionError } = await supabase
        .from('institutions')
        .insert({
          name: institutionName,
          code: institutionCode,
          admin_id: profile.id,
        })
        .select()
        .single();

      if (institutionError) {
        console.error('❌ Institution creation error:', institutionError);
        toast.error('Failed to create institution: ' + institutionError.message);
        return;
      }

      console.log('✅ Institution created:', institutionResult);

      // Update user profile with institution_id
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ institution_id: institutionResult.id })
        .eq('id', profile.id);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        toast.error('Failed to update profile: ' + updateError.message);
        return;
      }

      toast.success('Institution created successfully!');
      setShowCreateInstitution(false);
      
      // Update the profile and fetch data
      profile.institution_id = institutionResult.id;
      profile.institution_name = institutionResult.name;
      fetchInstitutionData();
    } catch (error) {
      console.error('❌ Institution creation failed:', error);
      toast.error('Failed to create institution');
    } finally {
      setIsCreating(false);
    }
  };

  const fetchInstitutionData = async () => {
    if (!profile.institution_id) return;

    try {
      // Get institution details
      const { data: institution, error: institutionError } = await supabase
        .from('institutions')
        .select('code, name')
        .eq('id', profile.institution_id)
        .single();

      if (institutionError) {
        console.error('Error fetching institution:', institutionError);
        toast.error('Failed to fetch institution data');
        return;
      }

      // Get students count and stats
      const { data: studentsData, error: studentsError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('institution_id', profile.institution_id)
        .eq('role', 'student');

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        return;
      }

      // Get lesson completion stats
      const studentIds = studentsData?.map(s => s.id) || [];
      let progressData = [];
      
      if (studentIds.length > 0) {
        const { data: progress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .in('user_id', studentIds);

        if (progressError) {
          console.error('Error fetching progress:', progressError);
        } else {
          progressData = progress || [];
        }
      }

      const totalLessons = progressData.reduce((sum, p) => sum + (p.lessons_completed || 0), 0);
      const activeStudents = studentsData?.filter(s => {
        const studentProgress = progressData.find(p => p.user_id === s.id);
        return studentProgress && studentProgress.last_activity_date && 
               new Date(studentProgress.last_activity_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      }).length || 0;

      setStats({
        totalStudents: studentsData?.length || 0,
        activeStudents,
        completedLessons: totalLessons,
        institutionCode: institution?.code || '',
        institutionName: institution?.name || ''
      });

      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error fetching institution data:', error);
      toast.error('Failed to fetch institution data');
    }
  };

  const copyInstitutionCode = () => {
    if (stats?.institutionCode) {
      navigator.clipboard.writeText(stats.institutionCode);
      setCodeCopied(true);
      toast.success('Institution code copied to clipboard!');
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  if (showCreateInstitution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                {profile.full_name[0]}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{profile.full_name}</h2>
                <p className="text-sm text-gray-500">Admin Setup</p>
              </div>
            </div>
            <Button onClick={onSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="p-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardHeader className="text-center">
              <School className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Create Your Institution</CardTitle>
              <CardDescription>
                Set up your institution to start managing students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input
                  id="institutionName"
                  type="text"
                  placeholder="Enter your institution name"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                onClick={createInstitution}
                disabled={isCreating || !institutionName.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {isCreating ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Institution
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
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
              {profile.full_name[0]}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{profile.full_name}</h2>
              <p className="text-sm text-gray-500">{stats?.institutionName || 'Institution'} • Admin</p>
            </div>
          </div>
          <Button onClick={onSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Institution Code Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <School className="w-6 h-6" />
              <span>Institution Code</span>
            </CardTitle>
            <CardDescription className="text-blue-100">
              Share this code with your students to let them join
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
              <div>
                <p className="text-2xl font-bold font-mono">{stats?.institutionCode || 'Loading...'}</p>
                <p className="text-sm text-blue-100">Institution Code</p>
              </div>
              <Button
                onClick={copyInstitutionCode}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                disabled={!stats?.institutionCode}
              >
                {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats?.totalStudents || 0}</p>
              <p className="text-sm text-gray-500">Total Students</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats?.activeStudents || 0}</p>
              <p className="text-sm text-gray-500">Active This Week</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md text-center">
            <CardContent className="p-4">
              <BookOpen className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats?.completedLessons || 0}</p>
              <p className="text-sm text-gray-500">Lessons Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Students</h3>
            <Badge variant="secondary">{students.length} enrolled</Badge>
          </div>
          
          {students.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No students yet</h4>
                <p className="text-gray-500 mb-4">
                  Share your institution code with students so they can join your school
                </p>
                <Button
                  onClick={copyInstitutionCode}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  disabled={!stats?.institutionCode}
                >
                  {codeCopied ? 'Copied!' : 'Copy Institution Code'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <Card key={student.id} className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {student.full_name[0]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{student.full_name}</h4>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
