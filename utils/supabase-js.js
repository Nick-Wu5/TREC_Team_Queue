import { createClient } from "@supabase/supabase-js";
require("dotenv").config({ path: ".env.local" });

// Load environment variables for client-side use
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Email:", process.env.SUPABASE_USER_EMAIL);
console.log("Password:", process.env.SUPABASE_USER_PASSWORD);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const loginUser = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.SUPABASE_USER_EMAIL,
    password: process.env.SUPABASE_USER_PASSWORD,
  });

  if (error) {
    console.error("Login Error:", error.message);
  } else {
    console.log("User logged in:", data.user);
    console.log("Session:", data.session);
  }
};

loginUser();
