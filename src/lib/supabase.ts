import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set'); // Don't log the actual URL for security
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Not set'); // Don't log the actual key

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the client works
supabase.auth.onAuthStateChange((event) => {
  console.log('Supabase auth event:', event);
});