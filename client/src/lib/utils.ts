import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    'notes': 'Notes',
    'past_papers': 'Past Papers',
    'handwritten_notes': 'Handwritten Notes',
    'important_questions': 'Important Questions',
    'assignments': 'Assignments',
    'lab_reports': 'Lab Reports',
    'syllabus': 'Syllabus',
    'reference_materials': 'Reference Materials'
  };
  return categoryNames[category] || category;
}

export function getNoticeTypeDisplayName(type: string): string {
  const typeNames: Record<string, string> = {
    'general': 'General',
    'exam': 'Exam',
    'assignment': 'Assignment',
    'event': 'Event',
    'urgent': 'Urgent'
  };
  return typeNames[type] || type;
}

export function getSemesterName(semester: number): string {
  const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  return `${ordinals[semester]} Semester`;
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
