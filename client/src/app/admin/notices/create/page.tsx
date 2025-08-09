'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  Calendar,
  Users,
  Type
} from 'lucide-react';
import api from '@/lib/api';
import { getNoticeTypeDisplayName } from '@/lib/utils';
import Link from 'next/link';

const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['general', 'exam', 'assignment', 'event', 'urgent']),
  targetSemesters: z.array(z.number()).optional(),
  isUrgent: z.boolean(),
  isPublished: z.boolean(),
  publishDate: z.string().optional(),
  expiryDate: z.string().optional()
});

type NoticeForm = z.infer<typeof noticeSchema>;

export default function CreateNoticePage() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<NoticeForm>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      type: 'general',
      isUrgent: false,
      isPublished: true,
      targetSemesters: []
    }
  });

  const watchType = watch('type');

  useEffect(() => {
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      setAdminData(JSON.parse(storedAdminData));
    }
  }, []);

  const handleSemesterToggle = (semester: number) => {
    const newSelectedSemesters = selectedSemesters.includes(semester)
      ? selectedSemesters.filter(s => s !== semester)
      : [...selectedSemesters, semester];
    
    setSelectedSemesters(newSelectedSemesters);
    setValue('targetSemesters', newSelectedSemesters);
  };

  const selectAllSemesters = () => {
    const allSemesters = [1, 2, 3, 4, 5, 6, 7, 8];
    setSelectedSemesters(allSemesters);
    setValue('targetSemesters', allSemesters);
  };

  const clearAllSemesters = () => {
    setSelectedSemesters([]);
    setValue('targetSemesters', []);
  };

  const onSubmit = async (data: NoticeForm) => {
    setCreating(true);
    setError('');

    try {
      const noticeData = {
        ...data,
        targetSemesters: selectedSemesters,
        publishDate: data.publishDate || undefined,
        expiryDate: data.expiryDate || undefined
      };

      await api.post('/notices', noticeData);

      setCreateSuccess(true);
      setTimeout(() => {
        router.push('/admin/notices');
      }, 2000);
    } catch (error: any) {
      console.error('Create notice error:', error);
      setError(error.response?.data?.message || 'Failed to create notice. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const noticeTypes = [
    { value: 'general', label: 'General', description: 'General announcements and information' },
    { value: 'exam', label: 'Exam', description: 'Examination related notices' },
    { value: 'assignment', label: 'Assignment', description: 'Assignment and project deadlines' },
    { value: 'event', label: 'Event', description: 'Events, seminars, and activities' },
    { value: 'urgent', label: 'Urgent', description: 'Urgent and important announcements' }
  ];

  if (createSuccess) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Notice Created!</h2>
            <p className="text-gray-600 mb-6">Your notice has been created successfully.</p>
            <div className="text-sm text-gray-500">Redirecting to notices management...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar adminData={adminData} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/notices"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Notices
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create Notice</h1>
            <p className="text-gray-600 mt-2">Create a new announcement or important notice</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Left Column (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Type className="h-5 w-5 mr-2" />
                    Notice Content
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        {...register('title')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"
                        placeholder="Enter notice title"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content *
                      </label>
                      <textarea
                        {...register('content')}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"
                        placeholder="Write your notice content here..."
                      />
                      {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        You can use line breaks to format your content
                      </p>
                    </div>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Target Audience
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Select semesters to target (leave empty for all students):
                      </p>
                      <div className="space-x-2">
                        <button
                          type="button"
                          onClick={selectAllSemesters}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={clearAllSemesters}
                          className="text-xs text-gray-600 hover:text-gray-700"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(semester => (
                        <label
                          key={semester}
                          className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                            selectedSemesters.includes(semester)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSemesters.includes(semester)}
                            onChange={() => handleSemesterToggle(semester)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">
                            Semester {semester}
                          </span>
                        </label>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500">
                      {selectedSemesters.length === 0 
                        ? 'Notice will be visible to all students'
                        : `Notice will be visible to ${selectedSemesters.length} semester${selectedSemesters.length > 1 ? 's' : ''}`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings - Right Column (1/3) */}
              <div className="space-y-6">
                {/* Notice Type */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notice Settings
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notice Type *
                      </label>
                      <div className="space-y-2">
                        {noticeTypes.map(type => (
                          <label
                            key={type.value}
                            className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                              watchType === type.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              {...register('type')}
                              type="radio"
                              value={type.value}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {type.label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {type.description}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="flex items-center">
                        <input
                          {...register('isUrgent')}
                          type="checkbox"
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Mark as urgent
                        </span>
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        Urgent notices will be highlighted and shown first
                      </p>
                    </div>

                    {/* Publish Status */}
                    <div>
                      <label className="flex items-center">
                        <input
                          {...register('isPublished')}
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Publish immediately
                        </span>
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        Uncheck to save as draft
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Scheduling (Optional)
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Publish Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Publish Date
                      </label>
                      <input
                        {...register('publishDate')}
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Leave empty to publish now
                      </p>
                    </div>

                    {/* Expiry Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        {...register('expiryDate')}
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Leave empty for no expiry
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/notices"
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={creating}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Create Notice
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
