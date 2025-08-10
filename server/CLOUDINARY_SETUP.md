# Cloudinary Setup for HamroBCA

## Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/
2. Sign up for a free account
3. Get your credentials from the dashboard

## Step 2: Get Your Credentials
From your Cloudinary dashboard, you'll need:
- **Cloud Name**
- **API Key** 
- **API Secret**

## Step 3: Add to Render Environment Variables
In your Render dashboard, add these environment variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 4: Deploy
After adding the environment variables, redeploy your backend.

## Benefits:
- ✅ Files persist permanently
- ✅ No more disappearing files
- ✅ Better performance
- ✅ Automatic image optimization
