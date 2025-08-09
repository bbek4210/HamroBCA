"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notice = exports.NoticeType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var NoticeType;
(function (NoticeType) {
    NoticeType["GENERAL"] = "general";
    NoticeType["EXAM"] = "exam";
    NoticeType["ASSIGNMENT"] = "assignment";
    NoticeType["EVENT"] = "event";
    NoticeType["URGENT"] = "urgent";
})(NoticeType || (exports.NoticeType = NoticeType = {}));
const noticeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: Object.values(NoticeType),
        default: NoticeType.GENERAL
    },
    targetSemesters: [{
            type: Number,
            min: 1,
            max: 8
        }],
    isUrgent: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, {
    timestamps: true
});
// Index for better query performance
noticeSchema.index({ publishDate: -1, isPublished: 1 });
noticeSchema.index({ targetSemesters: 1, isPublished: 1 });
exports.Notice = mongoose_1.default.model('Notice', noticeSchema);
//# sourceMappingURL=Notice.js.map