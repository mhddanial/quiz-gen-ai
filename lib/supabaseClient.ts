import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Kondisional: jika di client, pakai sessionStorage
const supabase =
  typeof window !== 'undefined'
    ? createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          storage: sessionStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : createClient(SUPABASE_URL, SUPABASE_KEY);

export { supabase };
