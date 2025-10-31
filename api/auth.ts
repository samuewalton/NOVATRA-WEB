import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method, body } = req;
    const { action, email, password, full_name } = body;

    if (method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }

    switch (action) {
      case 'signup':
        // Sign up new user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: full_name || ''
            }
          }
        });

        if (signUpError) throw signUpError;

        // Create user profile in users table
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('users')
            .insert([{
              id: signUpData.user.id,
              email: signUpData.user.email,
              full_name: full_name || '',
              role: 'customer'
            }]);

          if (profileError) console.error('Profile creation error:', profileError);
        }

        return res.status(200).json({
          user: signUpData.user,
          session: signUpData.session
        });

      case 'login':
        // Sign in existing user
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;

        return res.status(200).json({
          user: signInData.user,
          session: signInData.session
        });

      case 'logout':
        // Sign out
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;

        return res.status(200).json({ message: 'Logged out successfully' });

      case 'session':
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();
        return res.status(200).json({ session: sessionData.session });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('Auth API error:', error);
    return res.status(400).json({ error: error.message || 'Authentication failed' });
  }
}
