
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
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('=== AUTH CONTAINER MOUNTED ===');

    console.log('✅ Supabase configuration looks good, checking user...');

    // Check if user is already logged in
    const checkUser = async () => {
      try {
        console.log('Attempting to get current user...');
        const user = await AuthService.getCurrentUser();
        console.log('Current user result:', user);
        
        if (user) {
          console.log('User found, getting profile...');
          const profile = await AuthService.getUserProfile(user.id);
          console.log('User profile result:', profile);
          
          if (profile) {
            console.log('✅ User authenticated with profile, calling onAuthSuccess');
            onAuthSuccess(user, profile);
            return;
          } else {
            console.log('⚠️ User found but no profile');
          }
        } else {
          console.log('ℹ️ No current user found');
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        setHasError(true);
        setErrorMessage(`Authentication check failed: ${error.message}`);
      } finally {
        console.log('Setting loading to false');
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    console.log('Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, getting profile...');
        const profile = await AuthService.getUserProfile(session.user.id);
        if (profile) {
          console.log('✅ Profile found, calling onAuthSuccess');
          onAuthSuccess(session.user, profile);
        } else {
          console.log('❌ No profile found for signed in user');
        }
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [onAuthSuccess]);

  const handleAuthSuccess = async () => {
    console.log('=== AUTH SUCCESS HANDLER CALLED ===');
    try {
      const user = await AuthService.getCurrentUser();
      console.log('User after auth success:', user);
      
      if (user) {
        const profile = await AuthService.getUserProfile(user.id);
        console.log('Profile after auth success:', profile);
        
        if (profile) {
          console.log('✅ Calling onAuthSuccess from handler');
          onAuthSuccess(user, profile);
        } else {
          console.log('❌ No profile found in success handler');
          toast.error('Profile not found');
        }
      } else {
        console.log('❌ No user found in success handler');
        toast.error('User not found');
      }
    } catch (error) {
      console.error('❌ Error in auth success handler:', error);
      toast.error('Authentication error');
    }
  };

  console.log('=== AUTH CONTAINER RENDER STATE ===');
  console.log('isLoading:', isLoading);
  console.log('hasError:', hasError);
  console.log('errorMessage:', errorMessage);

  if (hasError) {
    console.log('Rendering error state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h2>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <div className="bg-gray-100 p-3 rounded-lg text-left text-sm font-mono mb-4">
            <div>VITE_SUPABASE_URL=your_supabase_url</div>
            <div>VITE_SUPABASE_ANON_KEY=your_supabase_key</div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Please set these environment variables and restart your development server.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    console.log('Rendering loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
          <p className="text-sm text-gray-500 mt-2">Check console for debug info</p>
        </div>
      </div>
    );
  }

  console.log('Rendering auth forms');
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
