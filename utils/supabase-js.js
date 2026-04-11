import { createClient } from "@supabase/supabase-js";

// Load environment variables for client-side use
const supabaseUrl = process.env.NEXT_PUBLIC_NEWDB_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_NEWDB_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables: NEXT_PUBLIC_NEWDB_SUPABASE_URL and NEXT_PUBLIC_NEWDB_SUPABASE_ANON_KEY must be set");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
