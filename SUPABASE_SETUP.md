# Supabase Setup Guide for NOVATRA

## Step 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com
2. Sign up / Login
3. Click "New Project"
4. Fill in:
   - **Name**: NOVATRA
   - **Database Password**: (choose strong password - SAVE IT!)
   - **Region**: Choose closest to your users (Europe for Israel)
   - **Plan**: Free (500MB, 50K monthly active users)
5. Click "Create new project"
6. Wait 2-3 minutes for setup

## Step 2: Get Connection Details

1. In your Supabase project dashboard
2. Go to **Settings** → **API**
3. Copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon/public key** (starts with: eyJhbGc...)
   - **service_role key** (KEEP SECRET! for server-side only)

## Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `DATABASE_SCHEMA.md`
3. Click "Run" to execute
4. Verify tables created in **Table Editor**

## Step 4: Set Environment Variables

Create `.env.local` file in project root:

```bash
# Supabase (Public - safe for frontend)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Supabase (Secret - for API routes only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Gemini API (Secret - for API routes only)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Step 5: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable:
   - ✅ Email/Password
   - ✅ (Optional) Google OAuth
   - ✅ (Optional) Magic Link
3. Configure email templates in **Email Templates**

## Step 6: Configure Storage (Optional - for user uploads)

1. Go to **Storage**
2. Create bucket: `product-images`
3. Set policy: Public read, Admin write

## Step 7: Deploy to Vercel

1. In Vercel dashboard, go to your project
2. **Settings** → **Environment Variables**
3. Add all variables from `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
   - `GEMINI_API_KEY` (keep secret!)
4. Redeploy

## Important Notes

⚠️ **Security**:
- Never commit `.env.local` to git
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS - use only in API routes
- The `ANON_KEY` is safe to expose - it respects RLS policies

✅ **Free Tier Limits**:
- 500MB Database
- 1GB File Storage
- 50K Monthly Active Users
- 2GB Bandwidth
- Good enough for launch!

🔒 **Row Level Security (RLS)**:
All tables have RLS enabled. Policies defined in `DATABASE_SCHEMA.md`.
