
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
  static async signUp(
    email: string, 
    password: string, 
    metadata: {
      full_name: string;
      role: 'admin' | 'student';
      institution_name?: string;
      institution_code?: string;
    }
  ) {
    console.log('=== SIGNUP ATTEMPT ===');
    console.log('Email:', email);
    console.log('Role:', metadata.role);
    console.log('Metadata:', metadata);

    try {
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name,
            role: metadata.role,
          },
        },
      });

      if (authError) {
        console.error('❌ Auth signup error:', authError);
        return { data: null, error: authError.message };
      }

      if (!authData.user) {
        console.error('❌ No user returned from signup');
        return { data: null, error: 'No user returned from signup' };
      }

      console.log('✅ Auth signup successful:', authData.user.id);

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // If admin role and institution name provided, create institution
      let institutionId = null;
      if (metadata.role === 'admin' && metadata.institution_name) {
        console.log('Creating institution for admin...');
        
        // Generate a unique code for the institution
        const institutionCode = metadata.institution_name
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '')
          .substring(0, 6) + Math.random().toString(36).substring(2, 5).toUpperCase();
        
        const { data: institutionResult, error: institutionError } = await supabase
          .from('institutions')
          .insert({
            name: metadata.institution_name,
            code: institutionCode,
            admin_id: authData.user.id,
          })
          .select()
          .single();

        if (institutionError) {
          console.error('❌ Institution creation error:', institutionError);
          return { data: null, error: institutionError.message };
        }

        institutionId = institutionResult.id;
        console.log('✅ Institution created:', institutionId);
      }

      // If student role and institution code provided, find institution
      if (metadata.role === 'student' && metadata.institution_code) {
        console.log('Looking up institution for student...');
        
        const { data: institution, error: institutionError } = await supabase
          .from('institutions')
          .select('id')
          .eq('code', metadata.institution_code)
          .single();

        if (institutionError || !institution) {
          console.error('❌ Institution lookup error:', institutionError);
          return { data: null, error: 'Invalid institution code' };
        }

        institutionId = institution.id;
        console.log('✅ Institution found:', institutionId);
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
          return { data: null, error: updateError.message };
        }

        console.log('✅ Profile updated with institution_id');
      }

      console.log('✅ Signup completed successfully');
      return { data: authData, error: null };
    } catch (error) {
      console.error('❌ Signup process failed:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Signup failed' };
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
      return { data: null, error: error.message };
    }

    console.log('✅ Signin successful:', data.user?.id);
    return { data, error: null };
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

  static async getInstitutionByCode(code: string) {
    console.log('=== GET INSTITUTION BY CODE ===');
    console.log('Code:', code);

    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('code', code)
        .single();

      if (error) {
        console.error('❌ Institution fetch error:', error);
        return null;
      }

      console.log('✅ Institution found:', data);
      return data;
    } catch (error) {
      console.error('❌ Institution fetch failed:', error);
      return null;
    }
  }
}
