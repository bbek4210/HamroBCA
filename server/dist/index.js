"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const routes_1 = __importDefault(require("./routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, database_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['http://localhost:3000'] // Add your production domain here
        : ['http://localhost:3000'],
    credentials: true
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Serve static files (uploaded content)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Add CORS headers for file serving
app.use('/uploads', (req, res, next) => {
    res.header('Cross-Origin-Embedder-Policy', 'require-corp');
    res.header('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});
// API Routes
app.use('/api', routes_1.default);
// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to HamroBCA API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            subjects: '/api/subjects',
            content: '/api/content',
            notices: '/api/notices'
        }
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 50MB.' });
        }
    }
    res.status(500).json({
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 HamroBCA API is ready!`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map