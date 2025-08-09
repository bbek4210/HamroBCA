import mongoose, { Document, Schema } from 'mongoose';

export enum ContentCategory {
  NOTES = 'notes',
  PAST_PAPERS = 'past_papers',
  HANDWRITTEN_NOTES = 'handwritten_notes',
  IMPORTANT_QUESTIONS = 'important_questions',
  ASSIGNMENTS = 'assignments',
  LAB_REPORTS = 'lab_reports',
  SYLLABUS = 'syllabus',
  REFERENCE_MATERIALS = 'reference_materials'
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

const contentSchema = new Schema<IContent>({
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
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
contentSchema.index({ semester: 1, subjectCode: 1, category: 1 });
contentSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Content = mongoose.model<IContent>('Content', contentSchema);
