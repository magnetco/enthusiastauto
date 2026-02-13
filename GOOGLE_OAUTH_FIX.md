# Google OAuth Callback Fix

## Problem
The Google OAuth callback was failing because:
1. The `NEXTAUTH_URL` was set to `http://localhost:3000` but the app runs on port `3040`
2. The session strategy was set to `jwt` but should be `database` when using PrismaAdapter
3. The authorized redirect URI in Google Cloud Console needs to match the actual callback URL

## Changes Made

### 1. Updated `.env.local`
Changed `NEXTAUTH_URL` from `http://localhost:3000` to `http://localhost:3040`

### 2. Updated `lib/auth/config.ts`
- Changed session strategy from `jwt` to `database` (required for PrismaAdapter)
- Added `allowDangerousEmailAccountLinking: true` to GoogleProvider (allows linking OAuth accounts with existing email accounts)
- Updated session callback to work with database sessions (removed JWT callback)

## Required: Update Google Cloud Console

You need to update the authorized redirect URIs in your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID: `61341800176-l4i5d8vl66bjitku4sp96m8854f4l3qa.apps.googleusercontent.com`
5. Click on it to edit
6. Under **Authorized redirect URIs**, add or update:
   - **Development**: `http://localhost:3040/api/auth/callback/google`
   - **Production**: `https://yourdomain.com/api/auth/callback/google` (when you deploy)
7. Save changes

## Testing

1. The dev server is now running on `http://localhost:3040`
2. Navigate to `http://localhost:3040/auth/signin`
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. You should be redirected to `/account` after successful authentication

## Notes

- The `allowDangerousEmailAccountLinking: true` option allows users who already have an account with email/password to link their Google account
- Database sessions are more secure and allow for better session management (revocation, etc.)
- Make sure your database is accessible and the Prisma client is properly configured
