import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  semester: number;
  creditHours: number;
  lectureHours: number;
  tutorialHours?: number;
  labHours?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  creditHours: {
    type: Number,
    required: true,
    min: 0
  },
  lectureHours: {
    type: Number,
    required: true,
    min: 0
  },
  tutorialHours: {
    type: Number,
    default: 0
  },
  labHours: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export const Subject = mongoose.model<ISubject>('Subject', subjectSchema);
