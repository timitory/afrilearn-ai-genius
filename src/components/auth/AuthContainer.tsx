
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile, AuthService } from '@/services/AuthService';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface AuthContainerProps {
  onAuthSuccess: (user: User, profile: UserProfile) => void;
}

const AuthContainer = ({ onAuthSuccess }: AuthContainerProps) => {
  console.log('=== AUTH CONTAINER RENDERING ===');
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContainer useEffect - checking auth state');
    
    const checkAuth = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        
        if (user) {
          console.log('User found, fetching profile...');
          const profile = await AuthService.getUserProfile(user.id);
          
          if (profile) {
            console.log('Profile found, calling onAuthSuccess');
            onAuthSuccess(user, profile);
            return;
          }
        }
        
        console.log('No authenticated user found');
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profile = await AuthService.getUserProfile(session.user.id);
          if (profile) {
            onAuthSuccess(session.user, profile);
          }
        } catch (error) {
          console.error('Failed to fetch profile after sign in:', error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onAuthSuccess]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center space-y-1 pb-2">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            📚
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome to STEM Learn</CardTitle>
          <CardDescription className="text-gray-600">
            Your AI-powered STEM learning platform
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <LoginForm onSuccess={onAuthSuccess} />
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <RegisterForm onSuccess={onAuthSuccess} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthContainer;
