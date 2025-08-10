# HamroBCA - BCA Education Platform

A comprehensive educational platform for BCA (Bachelor of Computer Applications) students in Nepal, providing study materials, past papers, notes, and announcements.

## 🎯 Features

### For Students (No Login Required)
- 📚 **8 Semesters**: Complete BCA curriculum navigation
- 📖 **Study Materials**: Notes, past papers, assignments, lab reports
- 🔍 **Advanced Search**: Find content by semester, subject, category
- 📢 **Notice Board**: Important announcements and updates
- 📋 **Complete Syllabus**: Full BCA syllabus display
- 📱 **Mobile Responsive**: Works perfectly on all devices

### For Admin
- 🔐 **Secure Login**: JWT-based authentication
- 📊 **Dashboard**: Platform statistics and analytics
- 📁 **Content Management**: Upload, edit, delete study materials
- 📢 **Notice Management**: Create targeted announcements
- 👥 **Subject Management**: Manage BCA subjects
- 📤 **File Upload**: Support for PDF, images, Word docs (up to 50MB)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/hamrobca.git
cd hamrobca
```

2. **Install dependencies**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. **Environment Setup**

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hamrobca?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=development
UPLOAD_DIR=uploads
```

Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. **Seed the database**
```bash
cd server
npx ts-node src/scripts/seedData.ts
```

5. **Start the servers**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

6. **Access the platform**
- **Frontend**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
  - Email: `admin@gmail.com`
  - Password: `admin123`

## 🚀 Production Deployment

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import repository
4. Set root directory to `client`
5. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
   ```

#### Backend (Railway)
1. Go to [Railway](https://railway.app)
2. Create new project from GitHub
3. Set root directory to `server`
4. Add environment variables (same as local .env)
5. Deploy

### Option 2: Vercel + Render

#### Backend (Render)
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory to `server`
5. Build command: `npm install && npm run build`
6. Start command: `npm start`

## 📁 Project Structure

```
HamroBCA/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable components
│   │   └── lib/          # Utilities and API
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & upload middleware
│   │   └── scripts/      # Database seeding
├── shared/                # Shared TypeScript types
└── uploads/              # File storage
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## 📊 API Endpoints

### Public Endpoints
```
GET  /api/health                    # Health check
GET  /api/subjects                  # All subjects
GET  /api/subjects/semester/:id     # Subjects by semester
GET  /api/content                   # All content (with filters)
GET  /api/notices                   # Published notices
GET  /api/notices/urgent           # Urgent notices
```

### Admin Endpoints (Protected)
```
POST /api/auth/login               # Admin login
POST /api/content                  # Upload content
PUT  /api/content/:id              # Update content
DELETE /api/content/:id            # Delete content
POST /api/notices                  # Create notice
PUT  /api/notices/:id              # Update notice
DELETE /api/notices/:id            # Delete notice
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hamrobca
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=production
UPLOAD_DIR=uploads
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## 📝 Content Categories

- **Notes** - Study notes and materials
- **Past Papers** - Previous year question papers
- **Handwritten Notes** - Student handwritten notes
- **Important Questions** - Chapter-wise important questions
- **Assignments** - Course assignments
- **Lab Reports** - Practical lab reports
- **Syllabus** - Course syllabus
- **Reference Materials** - Additional study materials

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Modern UI** - Clean and intuitive interface
- **Dark/Light Mode** - User preference support
- **Search & Filter** - Advanced content discovery
- **File Viewer** - View PDFs and images directly
- **Download Tracking** - Content popularity metrics

## 🔒 Security Features

- **JWT Authentication** - Secure admin access
- **Password Hashing** - bcrypt encryption
- **CORS Protection** - Cross-origin security
- **File Upload Validation** - Secure file handling
- **Input Validation** - Zod schema validation

## 📱 Mobile Support

- **Progressive Web App** - PWA capabilities
- **Touch Optimized** - Mobile-friendly interactions
- **Offline Support** - Cached content access
- **Push Notifications** - Important updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🎉 Acknowledgments

- BCA students and faculty for requirements
- Open source community for tools and libraries
- Nepal's educational institutions for inspiration

---

**Built with ❤️ for BCA students in Nepal** 🇳🇵
