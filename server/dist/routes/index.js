"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const subjects_1 = __importDefault(require("./subjects"));
const content_1 = __importDefault(require("./content"));
const notices_1 = __importDefault(require("./notices"));
const router = express_1.default.Router();
router.use('/auth', auth_1.default);
router.use('/subjects', subjects_1.default);
router.use('/content', content_1.default);
router.use('/notices', notices_1.default);
// Health check route
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'HamroBCA API is running',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map