# Vercel Deployment Guide

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
- Visit https://vercel.com
- Sign in with GitHub

### 2. Import Your Project
- Click "Add New..." → "Project"
- Select repository: `bikasranjanmalik/quizzapp`
- Click "Import"

### 3. Configure Project Settings

**IMPORTANT: Set Root Directory**
- Click "Edit" next to "Root Directory"
- Select `frontend` folder
- Click "Save"

**Framework Preset:**
- Should auto-detect as "Vite"
- If not, select "Vite" manually

**Build and Output Settings:**
- Build Command: `npm run build` (should auto-fill)
- Output Directory: `dist` (should auto-fill)
- Install Command: `npm install` (should auto-fill)

### 4. Add Environment Variables
- Expand "Environment Variables" section
- Add the following:
  - **Name:** `VITE_API_URL`
  - **Value:** `https://quizzapp-1-3yt4.onrender.com`
  - **Environment:** Select all (Production, Preview, Development)
- Click "Add"

### 5. Deploy
- Click "Deploy" button
- Wait 2-3 minutes for build to complete
- Your site will be available at: `https://quizzapp-mocha.vercel.app`

## Troubleshooting

### If you get 404 errors:

1. **Verify Root Directory:**
   - Go to: Project Settings → General
   - Ensure "Root Directory" is set to `frontend`
   - If not, change it and redeploy

2. **Check Build Logs:**
   - Go to: Deployments tab
   - Click on the latest deployment
   - Check if build completed successfully
   - Look for any errors in the logs

3. **Verify vercel.json:**
   - Should be in `frontend/vercel.json`
   - Contains rewrites for SPA routing

4. **Redeploy:**
   - Go to: Deployments tab
   - Click "..." on latest deployment
   - Select "Redeploy"

### If API calls fail:

1. **Check Environment Variables:**
   - Go to: Project Settings → Environment Variables
   - Verify `VITE_API_URL` is set correctly
   - Ensure it's enabled for all environments

2. **Check Backend CORS:**
   - Backend should allow your Vercel domain
   - Current allowed origins include: `https://quizzapp-mocha.vercel.app`

## After Deployment

1. Test your application:
   - Visit your Vercel URL
   - Test home page
   - Test admin login
   - Test quiz creation
   - Test quiz taking

2. Update Backend CORS (if needed):
   - If you get CORS errors, ensure backend allows your Vercel domain
   - Backend code has been updated to include Vercel domain

