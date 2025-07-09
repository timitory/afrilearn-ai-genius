
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'student';
  institution_id?: string;
  institution_name?: string;
  full_name: string;
  created_at: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  admin_id: string;
  created_at: string;
}

export class AuthService {
  static async signUp(email: string, password: string, userData: {
    full_name: string;
    role: 'admin' | 'student';
    institution_name?: string;
    institution_code?: string;
  }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: error.message };
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: error.message };
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error.message };
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          institutions(name)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        institution_name: data.institutions?.name
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  static async createInstitution(name: string, adminId: string) {
    try {
      const code = name.toUpperCase().replace(/\s+/g, '').substring(0, 6) + Math.random().toString(36).substring(2, 6);
      
      const { data, error } = await supabase
        .from('institutions')
        .insert({
          name,
          code,
          admin_id: adminId
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Create institution error:', error);
      return { data: null, error: error.message };
    }
  }

  static async getInstitutionByCode(code: string): Promise<Institution | null> {
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('code', code)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get institution error:', error);
      return null;
    }
  }
}
