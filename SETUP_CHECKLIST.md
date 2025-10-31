# ✅ Supabase Setup Checklist

## Part 1: Create Supabase Project (5 minutes)

### Step 1.1: Sign Up / Login
- [ ] Go to: https://supabase.com
- [ ] Click "Start your project" or "Sign in"
- [ ] Login with GitHub / Google / Email

### Step 1.2: Create New Project
- [ ] Click "New Project" button
- [ ] Fill in:
  - **Organization**: Create new or select existing
  - **Name**: `NOVATRA` (or any name you like)
  - **Database Password**: Choose strong password
    - ⚠️ SAVE THIS PASSWORD! You'll need it for direct DB access
  - **Region**: Select closest to Israel (usually **Europe West (London)** or **Europe Central (Frankfurt)**)
  - **Pricing Plan**: Free (500MB, enough for now)
- [ ] Click "Create new project"
- [ ] ⏰ Wait 2-3 minutes while Supabase sets up your database

---

## Part 2: Get Your Credentials (2 minutes)

### Step 2.1: Go to API Settings
- [ ] In your project dashboard, click **Settings** (⚙️ icon in sidebar)
- [ ] Click **API** in the left menu

### Step 2.2: Copy These Values
You'll see three important values. Copy them:

1. **Project URL**
   - Looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - [ ] Copy it

2. **anon / public key** (under "Project API keys")
   - Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - [ ] Copy it

3. **service_role key** (under "Project API keys")
   - Also starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ⚠️ This is SECRET! Never expose it in frontend code!
   - [ ] Copy it

📝 **Keep these values ready!** You'll paste them in the next step.

---

## Part 3: Initialize Database (3 minutes)

### Step 3.1: Open SQL Editor
- [ ] In Supabase dashboard, click **SQL Editor** in sidebar
- [ ] Click "+ New query" button

### Step 3.2: Run Database Schema
- [ ] Open the file `DATABASE_SCHEMA.md` in your project
- [ ] Copy ALL the SQL code (everything in the ```sql blocks)
- [ ] Paste it into the SQL Editor
- [ ] Click "Run" (or press Ctrl/Cmd + Enter)
- [ ] You should see: "Success. No rows returned"

### Step 3.3: Verify Tables Created
- [ ] Click **Table Editor** in sidebar
- [ ] You should see these tables:
  - products
  - users
  - orders
  - reviews
  - coupons
  - wishlist

✅ If you see all 6 tables, great! Database is ready!

---

## Part 4: Enable Authentication (1 minute)

### Step 4.1: Configure Email Auth
- [ ] Go to **Authentication** → **Providers** in sidebar
- [ ] **Email** should be enabled by default (toggle should be ON)
- [ ] (Optional) Enable Google OAuth if you want

✅ Authentication is ready!

---

## Part 5: Configure Environment Variables (3 minutes)

### Step 5.1: Create Local .env File
I'll create this for you with your credentials!

**Tell me when you have:**
- ✅ Project URL
- ✅ anon/public key
- ✅ service_role key

Then I'll create the `.env.local` file for you.

### Step 5.2: Add to Vercel (for production)
- [ ] Go to Vercel Dashboard → Your Project
- [ ] Click **Settings** → **Environment Variables**
- [ ] Add 4 variables (one by one):

1. `VITE_SUPABASE_URL`
   - Value: Your Project URL
   - [ ] Add

2. `VITE_SUPABASE_ANON_KEY`
   - Value: Your anon/public key
   - [ ] Add

3. `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your service_role key
   - ⚠️ Check "Encrypt"
   - [ ] Add

4. `GEMINI_API_KEY`
   - Value: Your Gemini API key (if you have one)
   - ⚠️ Check "Encrypt"
   - [ ] Add

- [ ] Click **Redeploy** to apply changes

---

## Part 6: Test Connection (2 minutes)

Once I create your .env.local file:

- [ ] I'll test the API connection
- [ ] I'll create a test product
- [ ] We'll verify it appears in Supabase

---

## 🎉 You're Done!

Total time: ~15 minutes

Next: We'll migrate your products from localStorage to Supabase!

---

## ❓ Where Are You Now?

Reply with:
- ✅ "Done Part 1" - I created the project
- ✅ "Done Part 2" - I have the credentials
- ✅ "Done Part 3" - Database is initialized
- ✅ "Done Part 4" - Auth is enabled
- ✅ "Need help with [step]" - I'm stuck on something
