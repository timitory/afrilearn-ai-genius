
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Mail, Lock, User, School, Code } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserProfile, AuthService } from '@/services/AuthService';
import { toast } from 'sonner';

interface RegisterFormProps {
  onSuccess: (user: SupabaseUser, profile: UserProfile) => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: '' as 'admin' | 'student' | '',
    institutionName: '',
    institutionCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (!formData.role) {
      setError('Please select a role');
      setIsLoading(false);
      return;
    }

    if (formData.role === 'admin' && !formData.institutionName.trim()) {
      setError('Institution name is required for admins');
      setIsLoading(false);
      return;
    }

    if (formData.role === 'student' && !formData.institutionCode.trim()) {
      setError('Institution code is required for students');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await AuthService.signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          role: formData.role,
          institution_name: formData.role === 'admin' ? formData.institutionName : undefined,
          institution_code: formData.role === 'student' ? formData.institutionCode : undefined,
        }
      );

      if (error) {
        setError(error);
        toast.error(error);
        return;
      }

      if (data?.user) {
        const profile = await AuthService.getUserProfile(data.user.id);
        if (profile) {
          toast.success('Account created successfully!');
          onSuccess(data.user, profile);
        } else {
          setError('Failed to load user profile after registration');
          toast.error('Failed to load user profile after registration');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleInputChange('role', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="admin">School Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.role === 'admin' && (
        <div className="space-y-2">
          <Label htmlFor="institutionName" className="text-sm font-medium text-gray-700">
            School/Institution Name
          </Label>
          <div className="relative">
            <School className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="institutionName"
              type="text"
              placeholder="Enter your school name"
              value={formData.institutionName}
              onChange={(e) => handleInputChange('institutionName', e.target.value)}
              className="pl-10"
              required={formData.role === 'admin'}
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {formData.role === 'student' && (
        <div className="space-y-2">
          <Label htmlFor="institutionCode" className="text-sm font-medium text-gray-700">
            Institution Code
          </Label>
          <div className="relative">
            <Code className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="institutionCode"
              type="text"
              placeholder="Enter your school's code"
              value={formData.institutionCode}
              onChange={(e) => handleInputChange('institutionCode', e.target.value.toUpperCase())}
              className="pl-10"
              required={formData.role === 'student'}
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-500">
            Get this code from your school administrator
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
