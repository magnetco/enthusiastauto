# Sanity CORS Configuration Guide

## Overview

Since Sanity Studio is embedded in the Next.js app at `/studio`, CORS configuration is needed to allow the Next.js app to access Sanity APIs.

## Steps to Configure CORS

### 1. Access Sanity Dashboard

Go to: https://www.sanity.io/manage/personal/project/n2usssau

### 2. Add CORS Origins

Navigate to **API** → **CORS Origins** and add the following origins:

#### Production

- **Origin:** `https://shop.enthusiastauto.com`
- **Allow credentials:** ✅ Yes

#### Local Development

- **Origin:** `http://localhost:3000`
- **Allow credentials:** ✅ Yes

### 3. Generate API Token

Navigate to **API** → **Tokens** and create a new token:

- **Token Name:** `Next.js Production Token`
- **Permissions:** **Editor**
- **Dataset:** `production`

Copy the generated token and add it to your `.env.local`:

```bash
SANITY_API_TOKEN="your_generated_token_here"
```

### 4. Generate Webhook Secret

Generate a secure random string for webhook signature verification:

```bash
# On macOS/Linux
openssl rand -base64 32
```

Add this to your `.env.local`:

```bash
SANITY_WEBHOOK_SECRET="your_generated_secret_here"
```

### 5. Configure Environment Variables in Vercel

Add all environment variables to your Vercel project:

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add the following variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `n2usssau`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `NEXT_PUBLIC_SANITY_API_VERSION` = `2025-10-21`
   - `SANITY_API_TOKEN` = (your generated token)
   - `SANITY_WEBHOOK_SECRET` = (your generated secret)

### 6. Security Best Practices

✅ **DO:**

- Store API tokens in environment variables only
- Use separate tokens for development and production
- Rotate tokens periodically
- Use webhook secrets for signature verification

❌ **DON'T:**

- Commit `.env.local` or `.env` files to git
- Share API tokens in public channels
- Use production tokens in development

## Verification

After configuration, verify:

1. Studio loads at `http://localhost:3000/studio`
2. You can authenticate and access the Studio
3. GROQ queries work in Vision plugin
4. No CORS errors in browser console
