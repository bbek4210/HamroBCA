# Deploy to Render

## Steps:

1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository: `bbek4210/HamroBCA`
5. Set Root Directory to: `server`
6. Set Build Command: `npm install && npm run build`
7. Set Start Command: `npm start`
8. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://hamrobca:hamrobca123@cluster0.bzcyvvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `your-secret-key-here`
   - `UPLOAD_DIR`: `uploads`
9. Click "Create Web Service"

## After Deployment:
- Update frontend API URL to the new Render URL
- Test the application
