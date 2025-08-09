import mongoose, { Document } from 'mongoose';
export declare enum ContentCategory {
    NOTES = "notes",
    PAST_PAPERS = "past_papers",
    HANDWRITTEN_NOTES = "handwritten_notes",
    IMPORTANT_QUESTIONS = "important_questions",
    ASSIGNMENTS = "assignments",
    LAB_REPORTS = "lab_reports",
    SYLLABUS = "syllabus",
    REFERENCE_MATERIALS = "reference_materials"
}
export interface IContent extends Document {
    title: string;
    description?: string;
    category: ContentCategory;
    semester: number;
    subjectCode: string;
    fileName: string;
    originalName?: string;
    filePath: string;
    fileSize: number;
    fileType: string;
    downloadCount: number;
    tags: string[];
    chapter?: string;
    unit?: string;
    isPublished: boolean;
    uploadedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Content: mongoose.Model<IContent, {}, {}, {}, mongoose.Document<unknown, {}, IContent, {}, {}> & IContent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Content.d.ts.map