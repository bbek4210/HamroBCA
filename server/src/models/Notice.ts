import mongoose, { Document, Schema } from 'mongoose';

export enum NoticeType {
  GENERAL = 'general',
  EXAM = 'exam',
  ASSIGNMENT = 'assignment',
  EVENT = 'event',
  URGENT = 'urgent'
}

export interface INotice extends Document {
  title: string;
  content: string;
  type: NoticeType;
  targetSemesters: number[]; // Empty array means all semesters
  isUrgent: boolean;
  isPublished: boolean;
  publishDate?: Date;
  expiryDate?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>({
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
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
noticeSchema.index({ publishDate: -1, isPublished: 1 });
noticeSchema.index({ targetSemesters: 1, isPublished: 1 });

export const Notice = mongoose.model<INotice>('Notice', noticeSchema);
