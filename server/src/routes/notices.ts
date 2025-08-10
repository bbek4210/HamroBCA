import express from 'express';
import { z } from 'zod';
import { Notice, NoticeType } from '../models';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.nativeEnum(NoticeType).optional(),
  targetSemesters: z.array(z.number().min(1).max(8)).optional(),
  isUrgent: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  publishDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional()
});

// @route   GET /api/notices
// @desc    Get all published notices
// @access  Public
router.get('/', async (req, res) => {
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  try {
    const { semester, type, page = 1, limit = 10 } = req.query;

    const query: any = {
      isPublished: true,
      $and: [
        {
          $or: [
            { publishDate: { $lte: new Date() } },
            { publishDate: { $exists: false } }
          ]
        },
        {
          $or: [
            { expiryDate: { $gt: new Date() } },
            { expiryDate: { $exists: false } }
          ]
        }
      ]
    };

    if (semester) {
      const semesterNum = parseInt(semester as string);
      query.$or = [
        { targetSemesters: { $size: 0 } }, // General notices
        { targetSemesters: semesterNum }
      ];
    }

    if (type) {
      query.type = type;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [notices, total] = await Promise.all([
      Notice.find(query)
        .sort({ isUrgent: -1, publishDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string))
        .populate('createdBy', 'email'),
      Notice.countDocuments(query)
    ]);

    res.json({
      notices,
      pagination: {
        current: parseInt(page as string),
        pages: Math.ceil(total / parseInt(limit as string)),
        total
      }
    });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notices/urgent
// @desc    Get urgent notices
// @access  Public
router.get('/urgent', async (req, res) => {
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  try {
    const { semester } = req.query;

    const query: any = {
      isPublished: true,
      isUrgent: true,
      $and: [
        {
          $or: [
            { publishDate: { $lte: new Date() } },
            { publishDate: { $exists: false } }
          ]
        },
        {
          $or: [
            { expiryDate: { $gt: new Date() } },
            { expiryDate: { $exists: false } }
          ]
        }
      ]
    };

    if (semester) {
      const semesterNum = parseInt(semester as string);
      query.$or = [
        { targetSemesters: { $size: 0 } },
        { targetSemesters: semesterNum }
      ];
    }

    const notices = await Notice.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'email');

    res.json(notices);
  } catch (error) {
    console.error('Get urgent notices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notices/:id
// @desc    Get single notice
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('createdBy', 'email');
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Check if notice is published and not expired
    if (!notice.isPublished || 
        (notice.publishDate && notice.publishDate > new Date()) ||
        (notice.expiryDate && notice.expiryDate < new Date())) {
      return res.status(403).json({ message: 'Notice not available' });
    }

    res.json(notice);
  } catch (error) {
    console.error('Get notice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/notices
// @desc    Create new notice
// @access  Private (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const validatedData = noticeSchema.parse({
      ...req.body,
      publishDate: req.body.publishDate ? new Date(req.body.publishDate) : undefined,
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined
    });

    const notice = new Notice({
      ...validatedData,
      createdBy: (req as any).admin._id
    });

    await notice.save();
    
    const populatedNotice = await Notice.findById(notice._id)
      .populate('createdBy', 'email');

    res.status(201).json(populatedNotice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: (error as any).errors 
      });
    }
    console.error('Create notice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notices/:id
// @desc    Update notice
// @access  Private (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const validatedData = noticeSchema.partial().parse({
      ...req.body,
      publishDate: req.body.publishDate ? new Date(req.body.publishDate) : undefined,
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined
    });

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'email');

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json(notice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: (error as any).errors 
      });
    }
    console.error('Update notice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notices/:id
// @desc    Delete notice
// @access  Private (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes for managing all notices
// @route   GET /api/notices/admin/all
// @desc    Get all notices for admin (including unpublished)
// @access  Private (Admin only)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [notices, total] = await Promise.all([
      Notice.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string))
        .populate('createdBy', 'email'),
      Notice.countDocuments()
    ]);

    res.json({
      notices,
      pagination: {
        current: parseInt(page as string),
        pages: Math.ceil(total / parseInt(limit as string)),
        total
      }
    });
  } catch (error) {
    console.error('Get admin notices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
