
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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log('AuthContainer mounted');
    
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || supabaseUrl === 'your-supabase-url' || !supabaseKey || supabaseKey === 'your-supabase-anon-key') {
      console.error('Supabase is not properly configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Check if user is already logged in
    const checkUser = async () => {
      try {
        console.log('Checking current user...');
        const user = await AuthService.getCurrentUser();
        console.log('Current user:', user);
        
        if (user) {
          const profile = await AuthService.getUserProfile(user.id);
          console.log('User profile:', profile);
          
          if (profile) {
            onAuthSuccess(user, profile);
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
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
    console.log('Auth success handler called');
    const user = await AuthService.getCurrentUser();
    if (user) {
      const profile = await AuthService.getUserProfile(user.id);
      if (profile) {
        onAuthSuccess(user, profile);
      }
    }
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h2>
          <p className="text-gray-600 mb-4">
            Supabase is not properly configured. Please set up your environment variables:
          </p>
          <div className="bg-gray-100 p-3 rounded-lg text-left text-sm font-mono mb-4">
            <div>VITE_SUPABASE_URL=your_supabase_url</div>
            <div>VITE_SUPABASE_ANON_KEY=your_supabase_key</div>
          </div>
          <p className="text-sm text-gray-500">
            Check the console for more details.
          </p>
        </div>
      </div>
    );
  }

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
