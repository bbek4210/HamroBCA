"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// Validation schemas
const contentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional(),
    category: zod_1.z.nativeEnum(models_1.ContentCategory),
    semester: zod_1.z.number().min(1).max(8),
    subjectCode: zod_1.z.string().min(1, 'Subject code is required'),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    chapter: zod_1.z.string().optional(),
    unit: zod_1.z.string().optional(),
    isPublished: zod_1.z.boolean().optional()
});
// @route   GET /api/content
// @desc    Get all content with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { semester, subjectCode, category, search, page = 1, limit = 20 } = req.query;
        // Build query
        const query = { isPublished: true };
        if (semester)
            query.semester = parseInt(semester);
        if (subjectCode)
            query.subjectCode = subjectCode.toUpperCase();
        if (category)
            query.category = category;
        // Text search
        if (search) {
            query.$text = { $search: search };
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [content, total] = await Promise.all([
            models_1.Content.find(query)
                .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate('uploadedBy', 'email'),
            models_1.Content.countDocuments(query)
        ]);
        res.json({
            content,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        });
    }
    catch (error) {
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
        const query = {
            semester: parseInt(semester),
            subjectCode: subjectCode.toUpperCase(),
            isPublished: true
        };
        if (category)
            query.category = category;
        const content = await models_1.Content.find(query)
            .sort({ createdAt: -1 })
            .populate('uploadedBy', 'email');
        // Group by category for better organization
        const groupedContent = content.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});
        res.json({
            content,
            groupedContent,
            stats: {
                total: content.length,
                byCategory: Object.keys(groupedContent).reduce((acc, key) => {
                    acc[key] = groupedContent[key].length;
                    return acc;
                }, {})
            }
        });
    }
    catch (error) {
        console.error('Get content by semester/subject error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   GET /api/content/:id
// @desc    Get single content item
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const content = await models_1.Content.findById(req.params.id)
            .populate('uploadedBy', 'email');
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json(content);
    }
    catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   POST /api/content
// @desc    Upload new content
// @access  Private (Admin only)
router.post('/', auth_1.authenticateAdmin, upload_1.upload.single('file'), async (req, res) => {
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
        const content = new models_1.Content({
            ...validatedData,
            subjectCode: validatedData.subjectCode.toUpperCase(),
            fileName: req.file.filename, // Use the actual saved filename, not originalname
            originalName: req.file.originalname, // Store original name separately
            filePath: req.file.path,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            uploadedBy: req.admin._id
        });
        await content.save();
        const populatedContent = await models_1.Content.findById(content._id)
            .populate('uploadedBy', 'email');
        res.status(201).json(populatedContent);
    }
    catch (error) {
        // Clean up uploaded file if validation fails
        if (req.file && fs_1.default.existsSync(req.file.path)) {
            fs_1.default.unlinkSync(req.file.path);
        }
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors
            });
        }
        console.error('Upload content error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   PUT /api/content/:id
// @desc    Update content metadata
// @access  Private (Admin only)
router.put('/:id', auth_1.authenticateAdmin, async (req, res) => {
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
        const content = await models_1.Content.findByIdAndUpdate(req.params.id, validatedData, { new: true, runValidators: true }).populate('uploadedBy', 'email');
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json(content);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors
            });
        }
        console.error('Update content error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   DELETE /api/content/:id
// @desc    Delete content
// @access  Private (Admin only)
router.delete('/:id', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const content = await models_1.Content.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        // Delete file from filesystem
        if (fs_1.default.existsSync(content.filePath)) {
            fs_1.default.unlinkSync(content.filePath);
        }
        await models_1.Content.findByIdAndDelete(req.params.id);
        res.json({ message: 'Content deleted successfully' });
    }
    catch (error) {
        console.error('Delete content error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   GET /api/content/:id/download
// @desc    Download content file
// @access  Public
router.get('/:id/download', async (req, res) => {
    try {
        const content = await models_1.Content.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        if (!content.isPublished) {
            return res.status(403).json({ message: 'Content not available' });
        }
        if (!fs_1.default.existsSync(content.filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Increment download count
        await models_1.Content.findByIdAndUpdate(req.params.id, {
            $inc: { downloadCount: 1 }
        });
        const fileName = content.fileName;
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', content.fileType);
        const fileStream = fs_1.default.createReadStream(content.filePath);
        fileStream.pipe(res);
    }
    catch (error) {
        console.error('Download content error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=content.js.map