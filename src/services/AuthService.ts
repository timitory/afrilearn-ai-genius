
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'student';
  institution_id: string | null;
  institution_name?: string;
  created_at: string;
}

export class AuthService {
  static async signUp(email: string, password: string, fullName: string, role: 'admin' | 'student', institutionData?: { name: string; code: string }) {
    console.log('=== SIGNUP ATTEMPT ===');
    console.log('Email:', email);
    console.log('Role:', role);
    console.log('Institution data:', institutionData);

    try {
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (authError) {
        console.error('❌ Auth signup error:', authError);
        throw authError;
      }

      if (!authData.user) {
        console.error('❌ No user returned from signup');
        throw new Error('No user returned from signup');
      }

      console.log('✅ Auth signup successful:', authData.user.id);

      // If admin role and institution data provided, create institution
      let institutionId = null;
      if (role === 'admin' && institutionData) {
        console.log('Creating institution for admin...');
        
        const { data: institutionResult, error: institutionError } = await supabase
          .from('institutions')
          .insert({
            name: institutionData.name,
            code: institutionData.code,
            admin_id: authData.user.id,
          })
          .select()
          .single();

        if (institutionError) {
          console.error('❌ Institution creation error:', institutionError);
          throw institutionError;
        }

        institutionId = institutionResult.id;
        console.log('✅ Institution created:', institutionId);
      }

      // Update user profile with institution_id if needed
      if (institutionId) {
        console.log('Updating user profile with institution_id...');
        
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ institution_id: institutionId })
          .eq('id', authData.user.id);

        if (updateError) {
          console.error('❌ Profile update error:', updateError);
          throw updateError;
        }

        console.log('✅ Profile updated with institution_id');
      }

      console.log('✅ Signup completed successfully');
      return authData;
    } catch (error) {
      console.error('❌ Signup process failed:', error);
      throw error;
    }
  }

  static async signIn(email: string, password: string) {
    console.log('=== SIGNIN ATTEMPT ===');
    console.log('Email:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Signin error:', error);
      throw error;
    }

    console.log('✅ Signin successful:', data.user?.id);
    return data;
  }

  static async signOut() {
    console.log('=== SIGNOUT ATTEMPT ===');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Signout error:', error);
      throw error;
    }

    console.log('✅ Signout successful');
  }

  static async getCurrentUser(): Promise<User | null> {
    console.log('=== GET CURRENT USER ===');
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Get user error:', error);
      throw error;
    }

    console.log('Current user result:', user?.id || 'null');
    return user;
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    console.log('=== GET USER PROFILE ===');
    console.log('User ID:', userId);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          institutions (
            name
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Profile fetch error:', error);
        throw error;
      }

      if (!data) {
        console.log('❌ No profile found');
        return null;
      }

      // Type assertion to ensure role is properly typed
      const profile: UserProfile = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role as 'admin' | 'student',
        institution_id: data.institution_id,
        institution_name: data.institutions?.name,
        created_at: data.created_at,
      };

      console.log('✅ Profile found:', profile);
      return profile;
    } catch (error) {
      console.error('❌ Profile fetch failed:', error);
      throw error;
    }
  }
}
