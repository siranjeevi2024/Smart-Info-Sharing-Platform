# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Smart Info Platform"
4. Click "Create"

## Step 2: Enable Google+ API

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - User Type: External
   - App name: Smart Info Platform
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue"
   - Scopes: Skip for now
   - Test users: Add your email
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: Web application
   - Name: Smart Info Platform Web Client
   - Authorized JavaScript origins:
     - http://localhost:3000
     - http://localhost:5000
   - Authorized redirect URIs:
     - http://localhost:5000/api/auth/google/callback
   - Click "Create"

5. Copy the Client ID and Client Secret

## Step 4: Update Backend .env File

Open `backend/.env` and update:

```
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

## Step 5: Install Dependencies

```bash
cd backend
npm install passport passport-google-oauth20 express-session
```

## Step 6: Restart Servers

Restart both backend and frontend servers.

## Step 7: Test Google Login

1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. Select your Google account
4. You should be redirected back and logged in!

## Troubleshooting

**Error: redirect_uri_mismatch**
- Make sure the redirect URI in Google Console exactly matches: `http://localhost:5000/api/auth/google/callback`

**Error: Access blocked**
- Add your email to test users in OAuth consent screen

**Error: Invalid client**
- Double-check your Client ID and Secret in .env file

## Production Deployment

For production, update:
1. Add production URLs to Google Console
2. Update GOOGLE_CALLBACK_URL in .env
3. Update FRONTEND_URL in .env
4. Verify OAuth consent screen for production use