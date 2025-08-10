'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { 
  Plus, 
  Search, 
  Bell, 
  Edit, 
  Trash2, 
  Calendar,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import api from '@/lib/api';
import { formatDate, formatDateTime, getNoticeTypeDisplayName } from '@/lib/utils';

interface Notice {
  _id: string;
  title: string;
  content: string;
  type: string;
  targetSemesters: number[];
  isUrgent: boolean;
  isPublished: boolean;
  publishDate?: string;
  expiryDate?: string;
  createdBy: {
    email: string;
  };
  createdAt: string;
}

export default function AdminNoticesPage() {
  const [adminData, setAdminData] = useState<{ email: string; name?: string } | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      setAdminData(JSON.parse(storedAdminData));
    }

    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType) params.append('type', selectedType);
      params.append('limit', '50');

      const response = await api.get(`/notices/admin/all?${params.toString()}`);
      let allNotices = response.data.notices || [];

      // Filter by search query on frontend
      if (searchQuery) {
        allNotices = allNotices.filter((notice: Notice) =>
          notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notice.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setNotices(allNotices);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchNotices();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedType]);

  const handleDelete = async (noticeId: string) => {
    try {
      setDeleting(true);
      await api.delete(`/notices/${noticeId}`);
      setNotices(notices.filter(notice => notice._id !== noticeId));
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting notice:', error);
      alert('Failed to delete notice. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const togglePublishStatus = async (noticeId: string, currentStatus: boolean) => {
    try {
      await api.put(`/notices/${noticeId}`, {
        isPublished: !currentStatus
      });
      
      setNotices(notices.map(notice => 
        notice._id === noticeId 
          ? { ...notice, isPublished: !currentStatus }
          : notice
      ));
    } catch (error) {
      console.error('Error updating publish status:', error);
      alert('Failed to update publish status. Please try again.');
    }
  };

  const getTargetAudience = (targetSemesters: number[]) => {
    if (targetSemesters.length === 0) return 'All Students';
    if (targetSemesters.length === 1) return `Semester ${targetSemesters[0]}`;
    if (targetSemesters.length <= 3) return targetSemesters.map(s => `Sem ${s}`).join(', ');
    return `${targetSemesters.length} Semesters`;
  };

  const noticeTypes = ['general', 'exam', 'assignment', 'event', 'urgent'];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar adminData={adminData || undefined} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notices Management</h1>
              <p className="text-gray-600 mt-2">Manage announcements and important notices</p>
            </div>
            <Link
              href="/admin/notices/create"
              className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Notice
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                {noticeTypes.map(type => (
                  <option key={type} value={type}>
                    {getNoticeTypeDisplayName(type)}
                  </option>
                ))}
              </select>

              {/* Results Count */}
              <div className="flex items-center text-sm text-gray-600">
                <Bell className="h-4 w-4 mr-2" />
                {loading ? 'Loading...' : `${notices.length} notices`}
              </div>
            </div>
          </div>

          {/* Notices List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading notices...</p>
              </div>
            ) : notices.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {searchQuery || selectedType 
                    ? 'No notices match your filters'
                    : 'No notices created yet'
                  }
                </p>
                <Link
                  href="/admin/notices/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Notice
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notices.map((notice) => (
                  <div key={notice._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                            {notice.title}
                          </h3>
                          
                          {/* Status Badges */}
                          <div className="flex items-center space-x-2">
                            {notice.isUrgent && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Urgent
                              </span>
                            )}
                            
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              notice.type === 'urgent' ? 'bg-red-100 text-red-800' :
                              notice.type === 'exam' ? 'bg-orange-100 text-orange-800' :
                              notice.type === 'assignment' ? 'bg-purple-100 text-purple-800' :
                              notice.type === 'event' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {getNoticeTypeDisplayName(notice.type)}
                            </span>

                            <button
                              onClick={() => togglePublishStatus(notice._id, notice.isPublished)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                notice.isPublished
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              } transition-colors`}
                            >
                              {notice.isPublished ? (
                                <>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Published
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3 mr-1" />
                                  Draft
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 line-clamp-2 mb-3">
                          {notice.content}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(notice.createdAt)}
                          </div>
                          
                          <div>
                            Target: {getTargetAudience(notice.targetSemesters)}
                          </div>

                          {notice.publishDate && (
                            <div>
                              Publish: {formatDateTime(notice.publishDate)}
                            </div>
                          )}

                          {notice.expiryDate && (
                            <div>
                              Expires: {formatDateTime(notice.expiryDate)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/admin/notices/edit/${notice._id}`}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setShowDeleteModal(notice._id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Delete Notice</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this notice? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
