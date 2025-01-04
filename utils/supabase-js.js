import { createClient } from "@supabase/supabase-js";

// Load environment variables for client-side use
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that the required environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

// Function to create a Supabase client with optional token
export const initializeSupabaseClient = (accessToken) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
    persistSession: true, // Keep session data between page reloads
    autoRefreshToken: true, // Automatically refresh expired tokens
  });
};

// Default Supabase client for unauthenticated access
export const supabase = initializeSupabaseClient();

// Login function
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login Error:", error.message);
      return null;
    }

    console.log("User logged in:", data.user);
    console.log("Session:", data.session);

    return data;
  } catch (err) {
    console.error("Unexpected Login Error:", err);
    return null;
  }
};

//loginUser(process.env.USER_EMAIL, process.env.USER_PASSWORD);
