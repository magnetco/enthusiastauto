# Quick CORS Fix for Studio

## The Error

You're seeing a CORS error because Sanity needs to know which origins (URLs) are allowed to access your project.

## Fix It Now (2 minutes)

### Step 1: Open Sanity Dashboard

Go to: **https://www.sanity.io/manage/personal/project/n2usssau/api**

(Or navigate: Sanity.io → Login → Your Projects → enthusiast-auto → API tab)

### Step 2: Add CORS Origins

1. Click on **"CORS Origins"** section
2. Click **"Add CORS origin"**
3. Add these origins:

**For Local Development:**
```
http://localhost:3000
```
- ✅ Check "Allow credentials"
- Click "Add origin"

**For Production (later):**
```
https://shop.enthusiastauto.com
```
- ✅ Check "Allow credentials"
- Click "Add origin"

### Step 3: Refresh Studio

After adding the origins:
1. Go back to http://localhost:3000/studio
2. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. The Studio should now load!

## What This Does

CORS (Cross-Origin Resource Sharing) is a security feature. By adding `http://localhost:3000`, you're telling Sanity:
> "Trust requests from my local Next.js app at localhost:3000"

## Common Issues

**Studio still not loading?**
- Make sure you hard refreshed (Cmd+Shift+R)
- Check that the origin is exactly `http://localhost:3000` (no trailing slash)
- Verify "Allow credentials" is checked

**Can't find the CORS section?**
- You might need admin permissions on the Sanity project
- Make sure you're logged into the Sanity account that created the project
