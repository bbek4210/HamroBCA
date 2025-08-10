# 🚀 HamroBCA Deployment Guide

## Quick Deployment Steps

### Step 1: Push Code to GitHub

1. **Create a GitHub repository**
   - Go to https://github.com
   - Click "New repository"
   - Name it: `hamrobca`
   - Make it public
   - Don't initialize with README

2. **Push your code**
   ```bash
   # In your project root directory
   git init
   git add .
   git commit -m "Initial commit - HamroBCA platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/hamrobca.git
   git push -u origin main
   ```

### Step 2: Deploy Backend to Railway

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your `hamrobca` repository**
6. **Configure the deployment**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

7. **Add Environment Variables**:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://hamrobca:hamrobca123@cluster0.bzcywvv.mongodb.net/hamrobca?retryWrites=true&w=majority
   JWT_SECRET=hamrobca_jwt_secret_change_in_production_2024
   NODE_ENV=production
   UPLOAD_DIR=uploads
   ```

8. **Deploy and get your backend URL**
   - Railway will give you a URL like: `https://hamrobca-backend-production-xxxx.up.railway.app`
   - Copy this URL for the next step

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your `hamrobca` repository**
5. **Configure the project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

6. **Add Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app/api
   ```
   (Replace with your actual Railway backend URL)

7. **Deploy**

### Step 4: Seed the Production Database

1. **Go to your Railway dashboard**
2. **Click on your backend service**
3. **Go to "Deployments" tab**
4. **Click on the latest deployment**
5. **Open the terminal/console**
6. **Run the seeding command**:
   ```bash
   npx ts-node src/scripts/seedData.ts
   ```

### Step 5: Test Your Deployed Platform

1. **Frontend URL**: Your Vercel URL (e.g., `https://hamrobca.vercel.app`)
2. **Admin Login**: `https://your-vercel-url.vercel.app/admin/login`
   - Email: `admin@gmail.com`
   - Password: `admin123`

## Alternative: Render Backend

If Railway doesn't work, use Render:

1. **Go to Render**: https://render.com
2. **Sign up/Login** with GitHub
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure**:
   - **Name**: `hamrobca-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

6. **Add Environment Variables** (same as Railway)
7. **Deploy**

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check if all dependencies are in `package.json`
   - Ensure TypeScript compilation works locally

2. **Database Connection Fails**
   - Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
   - Check connection string format

3. **Frontend Can't Connect to Backend**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check CORS settings in backend

4. **File Uploads Don't Work**
   - Railway/Render may not persist file uploads
   - Consider using cloud storage (AWS S3, CloudFlare R2)

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Database seeded with initial data
- [ ] Admin login working
- [ ] File uploads working
- [ ] All features tested

## Cost Estimation

- **Vercel**: Free tier (unlimited deployments)
- **Railway**: Free tier (500 hours/month)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month for basic usage

## Next Steps After Deployment

1. **Custom Domain**: Add your own domain
2. **SSL Certificate**: Automatic with Vercel/Railway
3. **Monitoring**: Set up error tracking
4. **Backup**: Regular database backups
5. **Scaling**: Upgrade plans as needed

---

**Your HamroBCA platform will be live and accessible to BCA students worldwide!** 🌍
