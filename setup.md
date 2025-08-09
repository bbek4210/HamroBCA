# HamroBCA Platform Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the `server` directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hamrobca
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hamrobca?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
UPLOAD_DIR=uploads
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Build and Start Backend

```bash
cd server
npm run build
npm run dev
```

### 4. Seed Database (Optional)

If you want to populate the database with initial data:

```bash
cd server
npx ts-node src/scripts/seedData.ts
```

This will create:
- Default admin account (admin@gmail.com / admin123)
- All BCA subjects for 8 semesters

### 5. Start Frontend

```bash
cd client
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login

### Default Admin Credentials
- **Email**: admin@gmail.com
- **Password**: admin123

## Project Structure

```
HamroBCA/
├── client/          # Next.js frontend
├── server/          # Node.js backend
├── shared/          # Shared types and utilities
└── setup.md         # This setup guide
```

## Features Implemented

✅ **User Features**:
- Homepage with dashboard
- Semester-wise navigation
- Subject pages with content
- BCA syllabus display
- Search and filtering
- File downloads
- Notice system
- Mobile responsive design

✅ **Backend Features**:
- REST API with Express.js
- MongoDB with Mongoose
- File upload system
- Authentication for admin
- Data validation with Zod
- TypeScript support

🔄 **Admin Panel** (Next Phase):
- Admin authentication
- Content management
- File uploads
- Notice management
- User analytics

## API Endpoints

### Public Endpoints
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/semester/:id` - Get subjects by semester
- `GET /api/content` - Get all content (with filters)
- `GET /api/content/:id/download` - Download content
- `GET /api/notices` - Get published notices
- `GET /api/health` - Health check

### Admin Endpoints (Protected)
- `POST /api/auth/login` - Admin login
- `POST /api/content` - Upload content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `POST /api/notices` - Create notice
- `PUT /api/notices/:id` - Update notice
- `DELETE /api/notices/:id` - Delete notice

## Technology Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Axios for API calls
- Lucide React for icons
- React Hook Form + Zod validation

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Multer for file uploads
- JWT for authentication
- Zod for validation
- CORS enabled

## Deployment Notes

For production deployment:
1. Set `NODE_ENV=production`
2. Use a secure JWT secret
3. Configure MongoDB Atlas
4. Set up file storage (AWS S3, etc.)
5. Configure proper CORS origins
6. Set up SSL certificates

## Support

If you encounter any issues during setup, check:
1. Node.js and npm versions
2. MongoDB connection
3. Environment variables
4. Port availability (3000, 5000)
5. Network/firewall settings
