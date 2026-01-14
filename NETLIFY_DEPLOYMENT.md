# Frontend Deployment Guide for Netlify

## Prerequisites
- Backend deployed at: `https://quizzapp-1-3yt4.onrender.com`
- GitHub repository connected

## Step-by-Step Deployment

### Step 1: Create Netlify Account
1. Go to https://www.netlify.com
2. Sign up/Login with GitHub
3. Authorize Netlify to access your repositories

### Step 2: Add New Site
1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select your repository: `bikasranjanmalik/quizzapp`
4. Click "Connect"

### Step 3: Configure Build Settings
In the build settings, configure:

**Base directory:** `frontend`

**Build command:** `npm run build`

**Publish directory:** `dist`

### Step 4: Set Environment Variables
Click "Show advanced" → "New variable" and add:

**Variable name:** `VITE_API_URL`

**Value:** `https://quizzapp-1-3yt4.onrender.com`

### Step 5: Deploy
1. Click "Deploy site"
2. Wait for build to complete
3. Your site will be live at: `https://your-site-name.netlify.app`

## Important Notes

- The `_redirects` file ensures React Router works correctly
- The `netlify.toml` file configures the build and redirects
- Environment variables are injected at build time
- After deployment, update the frontend URL in your backend CORS settings if needed

## Troubleshooting

**Issue: 404 on page refresh**
- Solution: The `_redirects` file should fix this. Ensure it's in `public/` folder.

**Issue: API calls failing**
- Solution: Check that `VITE_API_URL` is set correctly in Netlify environment variables.

**Issue: Build fails**
- Solution: Check build logs, ensure Node.js version is compatible (Netlify uses Node 18 by default).

