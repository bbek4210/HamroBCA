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
exports.Content = exports.ContentCategory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ContentCategory;
(function (ContentCategory) {
    ContentCategory["NOTES"] = "notes";
    ContentCategory["PAST_PAPERS"] = "past_papers";
    ContentCategory["HANDWRITTEN_NOTES"] = "handwritten_notes";
    ContentCategory["IMPORTANT_QUESTIONS"] = "important_questions";
    ContentCategory["ASSIGNMENTS"] = "assignments";
    ContentCategory["LAB_REPORTS"] = "lab_reports";
    ContentCategory["SYLLABUS"] = "syllabus";
    ContentCategory["REFERENCE_MATERIALS"] = "reference_materials";
})(ContentCategory || (exports.ContentCategory = ContentCategory = {}));
const contentSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: Object.values(ContentCategory),
        required: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    subjectCode: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    fileName: {
        type: String,
        required: true
    },
    originalName: {
        type: String
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    tags: [{
            type: String,
            trim: true
        }],
    chapter: {
        type: String,
        trim: true
    },
    unit: {
        type: String,
        trim: true
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    uploadedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, {
    timestamps: true
});
// Index for better search performance
contentSchema.index({ semester: 1, subjectCode: 1, category: 1 });
contentSchema.index({ title: 'text', description: 'text', tags: 'text' });
exports.Content = mongoose_1.default.model('Content', contentSchema);
//# sourceMappingURL=Content.js.map