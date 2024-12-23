import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bzeexenvhdzmpmrysutc.supabase.co';
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZWV4ZW52aGR6bXBtcnlzdXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NjQ0NTcsImV4cCI6MjA0NzU0MDQ1N30.41XkhCv_FVt1GnMOgJu8ptRJZ8ZcS3HKnplbr5_5kIg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const loginUser = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'wu2264@purdue.edu',
      password: 'xVkhfJMup!b6maj',
    });
  
    if (error) {
      console.error('Login Error:', error.message);
    } else {
      console.log('User logged in:', data.user);
      console.log('Session:', data.session);
    }
  };
  
  loginUser();
