import express from 'express';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { Content, ContentCategory } from '../models';
import { authenticateAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Validation schemas
const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.nativeEnum(ContentCategory),
  semester: z.number().min(1).max(8),
  subjectCode: z.string().min(1, 'Subject code is required'),
  tags: z.array(z.string()).optional(),
  chapter: z.string().optional(),
  unit: z.string().optional(),
  isPublished: z.boolean().optional()
});

// @route   GET /api/content
// @desc    Get all content with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      semester,
      subjectCode,
      category,
      search,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query: any = { isPublished: true };
    
    if (semester) query.semester = parseInt(semester as string);
    if (subjectCode) query.subjectCode = (subjectCode as string).toUpperCase();
    if (category) query.category = category;
    
    // Text search
    if (search) {
      query.$text = { $search: search as string };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [content, total] = await Promise.all([
      Content.find(query)
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string))
        .populate('uploadedBy', 'email'),
      Content.countDocuments(query)
    ]);

    res.json({
      content,
      pagination: {
        current: parseInt(page as string),
        pages: Math.ceil(total / parseInt(limit as string)),
        total
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/content/semester/:semester/subject/:subjectCode
// @desc    Get content by semester and subject
// @access  Public
router.get('/semester/:semester/subject/:subjectCode', async (req, res) => {
  try {
    const { semester, subjectCode } = req.params;
    const { category } = req.query;

    const query: any = {
      semester: parseInt(semester),
      subjectCode: subjectCode.toUpperCase(),
      isPublished: true
    };

    if (category) query.category = category;

    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'email');

    // Group by category for better organization
    const groupedContent = content.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof content>);

    res.json({
      content,
      groupedContent,
      stats: {
        total: content.length,
        byCategory: Object.keys(groupedContent).reduce((acc, key) => {
          acc[key] = groupedContent[key].length;
          return acc;
        }, {} as Record<string, number>)
      }
    });
  } catch (error) {
    console.error('Get content by semester/subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/content/:id
// @desc    Get single content item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('uploadedBy', 'email');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/content
// @desc    Upload new content
// @access  Private (Admin only)
router.post('/', authenticateAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const validatedData = contentSchema.parse({
      ...req.body,
      semester: parseInt(req.body.semester),
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      isPublished: req.body.isPublished !== undefined ? JSON.parse(req.body.isPublished) : true
    });

    const content = new Content({
      ...validatedData,
      subjectCode: validatedData.subjectCode.toUpperCase(),
      fileName: req.file.filename, // Use the actual saved filename, not originalname
      originalName: req.file.originalname, // Store original name separately
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      uploadedBy: (req as any).admin._id
    });

    await content.save();
    
    const populatedContent = await Content.findById(content._id)
      .populate('uploadedBy', 'email');

    res.status(201).json(populatedContent);
  } catch (error) {
    // Clean up uploaded file if validation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: (error as any).errors 
      });
    }
    console.error('Upload content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/content/:id
// @desc    Update content metadata
// @access  Private (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const validatedData = contentSchema.partial().parse({
      ...req.body,
      semester: req.body.semester ? parseInt(req.body.semester) : undefined,
      tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
      isPublished: req.body.isPublished !== undefined ? JSON.parse(req.body.isPublished) : undefined
    });

    if (validatedData.subjectCode) {
      validatedData.subjectCode = validatedData.subjectCode.toUpperCase();
    }

    const content = await Content.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'email');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: (error as any).errors 
      });
    }
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/content/:id
// @desc    Delete content
// @access  Private (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(content.filePath)) {
      fs.unlinkSync(content.filePath);
    }

    await Content.findByIdAndDelete(req.params.id);

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/content/:id/download
// @desc    Download content file
// @access  Public
router.get('/:id/download', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    if (!content.isPublished) {
      return res.status(403).json({ message: 'Content not available' });
    }

    if (!fs.existsSync(content.filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Increment download count
    await Content.findByIdAndUpdate(req.params.id, { 
      $inc: { downloadCount: 1 } 
    });

    const fileName = content.fileName;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', content.fileType);
    
    const fileStream = fs.createReadStream(content.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
