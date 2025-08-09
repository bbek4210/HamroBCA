"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation schemas
const subjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Subject name is required'),
    code: zod_1.z.string().min(1, 'Subject code is required'),
    semester: zod_1.z.number().min(1).max(8),
    creditHours: zod_1.z.number().min(0),
    lectureHours: zod_1.z.number().min(0),
    tutorialHours: zod_1.z.number().min(0).optional(),
    labHours: zod_1.z.number().min(0).optional(),
    description: zod_1.z.string().optional()
});
// @route   GET /api/subjects
// @desc    Get all subjects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const subjects = await models_1.Subject.find().sort({ semester: 1, name: 1 });
        res.json(subjects);
    }
    catch (error) {
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
        const subjects = await models_1.Subject.find({ semester }).sort({ name: 1 });
        res.json(subjects);
    }
    catch (error) {
        console.error('Get subjects by semester error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   GET /api/subjects/:code
// @desc    Get subject by code
// @access  Public
router.get('/:code', async (req, res) => {
    try {
        const subject = await models_1.Subject.findOne({ code: req.params.code.toUpperCase() });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json(subject);
    }
    catch (error) {
        console.error('Get subject error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   POST /api/subjects
// @desc    Create new subject
// @access  Private (Admin only)
router.post('/', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const validatedData = subjectSchema.parse(req.body);
        // Check if subject code already exists
        const existingSubject = await models_1.Subject.findOne({ code: validatedData.code.toUpperCase() });
        if (existingSubject) {
            return res.status(400).json({ message: 'Subject code already exists' });
        }
        const subject = new models_1.Subject({
            ...validatedData,
            code: validatedData.code.toUpperCase()
        });
        await subject.save();
        res.status(201).json(subject);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors
            });
        }
        console.error('Create subject error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   PUT /api/subjects/:code
// @desc    Update subject
// @access  Private (Admin only)
router.put('/:code', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const validatedData = subjectSchema.parse(req.body);
        const subject = await models_1.Subject.findOneAndUpdate({ code: req.params.code.toUpperCase() }, { ...validatedData, code: validatedData.code.toUpperCase() }, { new: true, runValidators: true });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json(subject);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors
            });
        }
        console.error('Update subject error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   DELETE /api/subjects/:code
// @desc    Delete subject
// @access  Private (Admin only)
router.delete('/:code', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const subject = await models_1.Subject.findOneAndDelete({ code: req.params.code.toUpperCase() });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json({ message: 'Subject deleted successfully' });
    }
    catch (error) {
        console.error('Delete subject error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=subjects.js.map