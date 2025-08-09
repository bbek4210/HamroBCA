import express from 'express';
import authRoutes from './auth';
import subjectRoutes from './subjects';
import contentRoutes from './content';
import noticeRoutes from './notices';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/content', contentRoutes);
router.use('/notices', noticeRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HamroBCA API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
