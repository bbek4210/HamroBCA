// Shared types between client and server
export interface Subject {
  _id: string;
  name: string;
  code: string;
  semester: number;
  creditHours: number;
  lectureHours: number;
  tutorialHours?: number;
  labHours?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface Content {
  _id: string;
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
  uploadedBy: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum NoticeType {
  GENERAL = 'general',
  EXAM = 'exam',
  ASSIGNMENT = 'assignment',
  EVENT = 'event',
  URGENT = 'urgent'
}

export interface Notice {
  _id: string;
  title: string;
  content: string;
  type: NoticeType;
  targetSemesters: number[];
  isUrgent: boolean;
  isPublished: boolean;
  publishDate?: string;
  expiryDate?: string;
  createdBy: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface ContentForm {
  title: string;
  description?: string;
  category: ContentCategory;
  semester: number;
  subjectCode: string;
  tags: string[];
  chapter?: string;
  unit?: string;
  isPublished: boolean;
  file: File;
}

export interface NoticeForm {
  title: string;
  content: string;
  type: NoticeType;
  targetSemesters: number[];
  isUrgent: boolean;
  isPublished: boolean;
  publishDate?: string;
  expiryDate?: string;
}

// Utility types
export interface CategoryStats {
  [key: string]: number;
}

export interface ContentStats {
  total: number;
  byCategory: CategoryStats;
}
