
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key present:', supabaseAnonKey !== 'your-supabase-anon-key');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
