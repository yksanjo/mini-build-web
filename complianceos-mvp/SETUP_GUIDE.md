# VerifyFlow Setup Guide

## Current Status Summary

✅ **Vercel Deployment**: Live at https://complianceos-mvp.vercel.app  
❌ **Supabase Database**: Schema needs to be created  
✅ **Frontend Code**: Ready and deployed  
✅ **API Code**: Ready (Vercel serverless functions)  
✅ **Supabase Client**: Configured in code  

## Step-by-Step Setup Instructions

### 1. Set Up Supabase Database

**Manual Step Required:**

1. **Go to Supabase Dashboard**:  
   https://supabase.com/dashboard/project/jyixgalqejdandnrmnqe

2. **Open SQL Editor**:  
   - Click on "SQL Editor" in the left sidebar

3. **Execute SQL Schema**:  
   - Copy the entire contents of `supabase-schema.sql`
   - Paste into the SQL Editor
   - Click "Run"

4. **Verify Tables**:  
   - Go to "Table Editor" in the left sidebar
   - You should see `kyc_cases` and `kyc_checks` tables
   - Check that sample data is inserted (3 cases, 12 checks)

### 2. Test Database Connection

After setting up the database:

```bash
cd complianceos-mvp
node test_supabase.js
```

**Expected Output:**
```
Testing Supabase connection...
✅ Supabase connection successful!
✅ Found 3 KYC cases in database:
  - KYC-2025-001: Sarah Chen (approved)
  - KYC-2025-002: Michael Rodriguez (review)
  - KYC-2025-003: James Wilson (approved)
✅ kyc_checks table exists with 12 records
```

### 3. Test Full Application

1. **Frontend**: https://complianceos-mvp.vercel.app
2. **Navigate to App**: Go to `/app` route
3. **Check Console**: Open browser DevTools → Console
   - Should show successful Supabase connection
   - No errors should appear

### 4. Deploy Latest Changes (Optional)

If you've made changes to the code:

```bash
cd complianceos-mvp

# Commit changes
git add .
git commit -m "Update: [describe changes]"

# Push to GitHub
git push origin master

# Vercel will automatically redeploy
```

## Technical Architecture

```
Frontend (Vercel)
├── React + Vite
├── Supabase JS Client
└── API Routes → Vercel Serverless Functions

Backend (Supabase)
├── PostgreSQL Database
├── Tables: kyc_cases, kyc_checks
├── Row Level Security (RLS)
└── REST API + Realtime

Data Flow:
Frontend → API Routes → Supabase Client → Supabase Database
```

## Environment Variables

Already configured in `.env.local`:
- `VITE_SUPABASE_URL`: https://jyixgalqejdandnrmnqe.supabase.co
- `VITE_SUPABASE_ANON_KEY`: [anon key]
- `VITE_API_URL`: /api

**Vercel automatically uses these environment variables.**

## Troubleshooting

### Database Connection Fails
1. Check Supabase project is active
2. Verify SQL schema executed successfully
3. Check API keys in Supabase Settings → API

### Frontend Shows Mock Data
1. Check browser console for errors
2. Verify Supabase tables exist
3. Check CORS settings in Supabase (Settings → API)

### API Routes Return 500 Errors
1. Check Vercel function logs
2. Verify Supabase client initialization
3. Check environment variables in Vercel dashboard

## Security Notes

1. **Row Level Security**: Enabled but with permissive policies for development
2. **API Keys**: Anon key is safe for frontend use
3. **Service Role Key**: Keep secure, not for frontend use
4. **CORS**: Configured to allow all origins (adjust for production)

## Next Steps After Setup

1. ✅ Test basic functionality
2. ✅ Verify data flows correctly
3. ⬜ Add authentication (Supabase Auth)
4. ⬜ Implement file uploads (Supabase Storage)
5. ⬜ Add real-time updates (Supabase Realtime)
6. ⬜ Set up proper RLS policies
7. ⬜ Add monitoring and logging

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Project Issues**: Check GitHub repository

---

**Quick Test Command:**
```bash
# Test database
node test_supabase.js

# Test build
npm run build

# Test dev server
npm run dev
```
