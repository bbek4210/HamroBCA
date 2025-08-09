"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.authenticateAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }
        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const admin = await models_1.Admin.findById(decoded.adminId);
        if (!admin) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        req.admin = {
            _id: admin._id.toString(),
            email: admin.email
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
exports.authenticateAdmin = authenticateAdmin;
const generateToken = (adminId) => {
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    return jsonwebtoken_1.default.sign({ adminId }, jwtSecret, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
//# sourceMappingURL=auth.js.map