
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthService, UserProfile } from '@/services/AuthService';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { toast } from 'sonner';

interface AuthContainerProps {
  onAuthSuccess: (user: User, profile: UserProfile) => void;
}

const AuthContainer = ({ onAuthSuccess }: AuthContainerProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          const profile = await AuthService.getUserProfile(user.id);
          if (profile) {
            onAuthSuccess(user, profile);
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await AuthService.getUserProfile(session.user.id);
        if (profile) {
          onAuthSuccess(session.user, profile);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  const handleAuthSuccess = async () => {
    const user = await AuthService.getCurrentUser();
    if (user) {
      const profile = await AuthService.getUserProfile(user.id);
      if (profile) {
        onAuthSuccess(user, profile);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
      {isLogin ? (
        <LoginForm
          onSuccess={handleAuthSuccess}
          onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};

export default AuthContainer;
