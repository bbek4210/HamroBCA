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
const noticeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    content: zod_1.z.string().min(1, 'Content is required'),
    type: zod_1.z.nativeEnum(models_1.NoticeType).optional(),
    targetSemesters: zod_1.z.array(zod_1.z.number().min(1).max(8)).optional(),
    isUrgent: zod_1.z.boolean().optional(),
    isPublished: zod_1.z.boolean().optional(),
    publishDate: zod_1.z.string().datetime().optional(),
    expiryDate: zod_1.z.string().datetime().optional()
});
// @route   GET /api/notices
// @desc    Get all published notices
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { semester, type, page = 1, limit = 10 } = req.query;
        const query = {
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
            const semesterNum = parseInt(semester);
            query.$or = [
                { targetSemesters: { $size: 0 } }, // General notices
                { targetSemesters: semesterNum }
            ];
        }
        if (type) {
            query.type = type;
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [notices, total] = await Promise.all([
            models_1.Notice.find(query)
                .sort({ isUrgent: -1, publishDate: -1, createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate('createdBy', 'email'),
            models_1.Notice.countDocuments(query)
        ]);
        res.json({
            notices,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        });
    }
    catch (error) {
        console.error('Get notices error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   GET /api/notices/urgent
// @desc    Get urgent notices
// @access  Public
router.get('/urgent', async (req, res) => {
    try {
        const { semester } = req.query;
        const query = {
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
            const semesterNum = parseInt(semester);
            query.$or = [
                { targetSemesters: { $size: 0 } },
                { targetSemesters: semesterNum }
            ];
        }
        const notices = await models_1.Notice.find(query)
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('createdBy', 'email');
        res.json(notices);
    }
    catch (error) {
        console.error('Get urgent notices error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   GET /api/notices/:id
// @desc    Get single notice
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const notice = await models_1.Notice.findById(req.params.id)
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
    }
    catch (error) {
        console.error('Get notice error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   POST /api/notices
// @desc    Create new notice
// @access  Private (Admin only)
router.post('/', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const validatedData = noticeSchema.parse({
            ...req.body,
            publishDate: req.body.publishDate ? new Date(req.body.publishDate) : undefined,
            expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined
        });
        const notice = new models_1.Notice({
            ...validatedData,
            createdBy: req.admin._id
        });
        await notice.save();
        const populatedNotice = await models_1.Notice.findById(notice._id)
            .populate('createdBy', 'email');
        res.status(201).json(populatedNotice);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors
            });
        }
        console.error('Create notice error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   PUT /api/notices/:id
// @desc    Update notice
// @access  Private (Admin only)
router.put('/:id', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const validatedData = noticeSchema.partial().parse({
            ...req.body,
            publishDate: req.body.publishDate ? new Date(req.body.publishDate) : undefined,
            expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined
        });
        const notice = await models_1.Notice.findByIdAndUpdate(req.params.id, validatedData, { new: true, runValidators: true }).populate('createdBy', 'email');
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }
        res.json(notice);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors
            });
        }
        console.error('Update notice error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   DELETE /api/notices/:id
// @desc    Delete notice
// @access  Private (Admin only)
router.delete('/:id', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const notice = await models_1.Notice.findByIdAndDelete(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }
        res.json({ message: 'Notice deleted successfully' });
    }
    catch (error) {
        console.error('Delete notice error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Admin routes for managing all notices
// @route   GET /api/notices/admin/all
// @desc    Get all notices for admin (including unpublished)
// @access  Private (Admin only)
router.get('/admin/all', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [notices, total] = await Promise.all([
            models_1.Notice.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate('createdBy', 'email'),
            models_1.Notice.countDocuments()
        ]);
        res.json({
            notices,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        });
    }
    catch (error) {
        console.error('Get admin notices error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=notices.js.map