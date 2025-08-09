import express from 'express';
import { z } from 'zod';
import { Subject } from '../models';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  semester: z.number().min(1).max(8),
  creditHours: z.number().min(0),
  lectureHours: z.number().min(0),
  tutorialHours: z.number().min(0).optional(),
  labHours: z.number().min(0).optional(),
  description: z.string().optional()
});

// @route   GET /api/subjects
// @desc    Get all subjects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ semester: 1, name: 1 });
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subjects/semester/:semester
// @desc    Get subjects by semester
// @access  Public
router.get('/semester/:semester', async (req, res) => {
  try {
    const semester = parseInt(req.params.semester);
    if (semester < 1 || semester > 8) {
      return res.status(400).json({ message: 'Invalid semester number' });
    }

    const subjects = await Subject.find({ semester }).sort({ name: 1 });
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects by semester error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subjects/:code
// @desc    Get subject by code
// @access  Public
router.get('/:code', async (req, res) => {
  try {
    const subject = await Subject.findOne({ code: req.params.code.toUpperCase() });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/subjects
// @desc    Create new subject
// @access  Private (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const validatedData = subjectSchema.parse(req.body);

    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ code: validatedData.code.toUpperCase() });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject code already exists' });
    }

    const subject = new Subject({
      ...validatedData,
      code: validatedData.code.toUpperCase()
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: (error as any).errors 
      });
    }
    console.error('Create subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/subjects/:code
// @desc    Update subject
// @access  Private (Admin only)
router.put('/:code', authenticateAdmin, async (req, res) => {
  try {
    const validatedData = subjectSchema.parse(req.body);
    
    const subject = await Subject.findOneAndUpdate(
      { code: req.params.code.toUpperCase() },
      { ...validatedData, code: validatedData.code.toUpperCase() },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: (error as any).errors 
      });
    }
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/subjects/:code
// @desc    Delete subject
// @access  Private (Admin only)
router.delete('/:code', authenticateAdmin, async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({ code: req.params.code.toUpperCase() });
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
