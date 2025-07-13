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
      // If student role and institution code provided, validate it first
      if (metadata.role === 'student' && metadata.institution_code) {
        console.log('Validating institution code:', metadata.institution_code);
        
        const { data: institution, error: institutionLookupError } = await supabase
          .from('institutions')
          .select('id, name, code')
          .eq('code', metadata.institution_code.toUpperCase())
          .maybeSingle();

        console.log('Institution lookup result:', { institution, error: institutionLookupError });

        if (institutionLookupError) {
          console.error('❌ Institution lookup failed:', institutionLookupError);
          return { data: null, error: 'Error looking up institution. Please try again.' };
        }

        if (!institution) {
          // Let's also check what institutions exist for debugging
          const { data: allInstitutions } = await supabase
            .from('institutions')
            .select('code, name');
          console.log('Available institutions:', allInstitutions);
          
          return { data: null, error: 'Invalid institution code. Please check with your school administrator.' };
        }

        console.log('✅ Institution found:', institution);
      }

      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name,
            role: metadata.role,
            institution_name: metadata.institution_name, // Store this for later use
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

      // Wait longer for the trigger to create the profile
      console.log('Waiting for profile creation...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // For admin users, create institution using the user ID directly
      if (metadata.role === 'admin' && metadata.institution_name) {
        console.log('Creating institution for admin user...');
        
        const { error: institutionError } = await this.createInstitutionForUser(
          authData.user.id, 
          metadata.institution_name
        );
        
        if (institutionError) {
          console.error('Failed to create institution:', institutionError);
          // Don't return error here - the user account was created successfully
          // We'll handle this in the UI
        } else {
          console.log('✅ Institution created successfully');
        }
      }

      // If student role and institution code provided, find institution and update profile
      if (metadata.role === 'student' && metadata.institution_code) {
        console.log('Looking up institution for student...');
        
        const { data: institution, error: institutionError } = await supabase
          .from('institutions')
          .select('id')
          .eq('code', metadata.institution_code.toUpperCase())
          .maybeSingle();

        if (institutionError) {
          console.error('❌ Institution lookup error during profile update:', institutionError);
          return { data: null, error: 'Error looking up institution during profile update' };
        }

        if (!institution) {
          console.error('❌ Institution not found during profile update');
          return { data: null, error: 'Invalid institution code' };
        }

        const institutionId = institution.id;
        console.log('✅ Institution found:', institutionId);

        // Update user profile with institution_id
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

  static async createInstitutionForUser(userId: string, institutionName: string) {
    console.log('=== CREATE INSTITUTION FOR USER ===');
    console.log('User ID:', userId);
    console.log('Institution name:', institutionName);

    try {
      // Generate a unique code for the institution
      const institutionCode = institutionName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 4) + Math.random().toString(36).substring(2, 6).toUpperCase();
      
      console.log('Creating institution with code:', institutionCode);

      const { data: institutionResult, error: institutionError } = await supabase
        .from('institutions')
        .insert({
          name: institutionName,
          code: institutionCode,
          admin_id: userId,
        })
        .select()
        .maybeSingle();

      if (institutionError) {
        console.error('❌ Institution creation error:', institutionError);
        return { data: null, error: institutionError.message };
      }

      if (!institutionResult) {
        return { data: null, error: 'Failed to create institution' };
      }

      console.log('✅ Institution created:', institutionResult.id, 'with code:', institutionCode);

      // Update user profile with institution_id
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ institution_id: institutionResult.id })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        return { data: null, error: updateError.message };
      }

      console.log('✅ Profile updated with institution_id');
      return { data: institutionResult, error: null };
    } catch (error) {
      console.error('❌ Institution creation failed:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Institution creation failed' };
    }
  }

  static async createInstitutionForAdmin(institutionName: string) {
    console.log('=== CREATE INSTITUTION FOR ADMIN ===');
    console.log('Institution name:', institutionName);

    try {
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      return await this.createInstitutionForUser(user.id, institutionName);
    } catch (error) {
      console.error('❌ Institution creation failed:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Institution creation failed' };
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
      // Retry logic to handle timing issues with profile creation
      let retries = 5;
      let profile = null;

      while (retries > 0 && !profile) {
        console.log(`Attempting to fetch profile (${6 - retries}/5)...`);
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select(`
            *,
            institutions (
              name
            )
          `)
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('❌ Profile fetch error:', error);
          throw error;
        }

        if (data) {
          profile = data;
          break;
        }

        retries--;
        if (retries > 0) {
          console.log('Profile not found, waiting 2 seconds before retry...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!profile) {
        console.log('❌ No profile found after retries');
        return null;
      }

      // Type assertion to ensure role is properly typed
      const userProfile: UserProfile = {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role as 'admin' | 'student',
        institution_id: profile.institution_id,
        institution_name: profile.institutions?.name,
        created_at: profile.created_at,
      };

      console.log('✅ Profile found:', userProfile);
      return userProfile;
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
        .eq('code', code.toUpperCase())
        .maybeSingle();

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
