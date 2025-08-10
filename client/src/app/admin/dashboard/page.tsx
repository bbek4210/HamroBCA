'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { 
  FileText, 
  Bell, 
  BookOpen, 
  Download,
  Plus,
  Eye,
  BarChart3,
  Clock
} from 'lucide-react';
import api from '@/lib/api';
import { formatDate, getCategoryDisplayName, getSemesterName } from '@/lib/utils';

interface DashboardStats {
  totalContent: number;
  totalSubjects: number;
  totalNotices: number;
  totalDownloads: number;
  recentContent: Array<{ _id: string; title: string; category: string; semester: number; subjectCode: string; createdAt: string; downloadCount?: number }>;
  recentNotices: Array<{ _id: string; title: string; content: string; isUrgent: boolean; type?: string; createdAt: string; isPublished?: boolean }>;
  contentByCategory: Record<string, number>;
  contentBySemester: Record<string, number>;
}

export default function AdminDashboardPage() {
  const [adminData, setAdminData] = useState<{ email: string; name?: string } | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    totalSubjects: 0,
    totalNotices: 0,
    totalDownloads: 0,
    recentContent: [],
    recentNotices: [],
    contentByCategory: {},
    contentBySemester: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get admin data from localStorage
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      setAdminData(JSON.parse(storedAdminData));
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const [contentRes, subjectsRes, noticesRes] = await Promise.all([
          api.get('/content?limit=5'),
          api.get('/subjects'),
          api.get('/notices/admin/all?limit=5')
        ]);

        const content = contentRes.data.content || [];
        const totalDownloads = content.reduce((sum: number, item: { downloadCount?: number }) => sum + (item.downloadCount || 0), 0);

        // Group content by category
        const contentByCategory = content.reduce((acc: Record<string, number>, item: { category: string }) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {});

        // Group content by semester
        const contentBySemester = content.reduce((acc: Record<string, number>, item: { semester: number }) => {
          const semester = `Semester ${item.semester}`;
          acc[semester] = (acc[semester] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalContent: contentRes.data.pagination?.total || 0,
          totalSubjects: subjectsRes.data?.length || 0,
          totalNotices: noticesRes.data.pagination?.total || 0,
          totalDownloads,
          recentContent: content,
          recentNotices: noticesRes.data.notices || [],
          contentByCategory,
          contentBySemester
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Upload Content',
      description: 'Add new study materials',
      icon: Plus,
      href: '/admin/content/upload',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Create Notice',
      description: 'Post important announcements',
      icon: Bell,
      href: '/admin/notices/create',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Add Subject',
      description: 'Create new subject',
      icon: BookOpen,
      href: '/admin/subjects/create',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'View Analytics',
      description: 'Check platform statistics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar adminData={adminData || undefined} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {adminData?.email || 'Admin'}! Here&apos;s what&apos;s happening on HamroBCA.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Content</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalContent}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Subjects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalSubjects}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-3">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Notices</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalNotices}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 rounded-full p-3">
                  <Download className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalDownloads}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className={`${action.color} text-white rounded-lg p-6 transition-colors group`}
                >
                  <action.icon className="h-8 w-8 mb-3" />
                  <h3 className="text-lg font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Content */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Content</h2>
                  <Link
                    href="/admin/content"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : stats.recentContent.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentContent.map((item) => (
                      <div key={item._id} className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {getCategoryDisplayName(item.category)} • {getSemesterName(item.semester)} • {item.subjectCode}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(item.createdAt)}
                          </div>
                        </div>
                        <div className="ml-4 flex items-center text-xs text-gray-500">
                          <Eye className="h-3 w-3 mr-1" />
                          {item.downloadCount}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No content uploaded yet</p>
                )}
              </div>
            </div>

            {/* Recent Notices */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Notices</h2>
                  <Link
                    href="/admin/notices"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : stats.recentNotices.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentNotices.map((notice) => (
                      <div key={notice._id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                              {notice.title}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notice.content.substring(0, 100)}...
                            </p>
                            <div className="flex items-center mt-2 text-xs">
                              <span className={`px-2 py-1 rounded-full ${
                                notice.isUrgent 
                                  ? 'bg-red-100 text-red-800' 
                                  : notice.isPublished 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {notice.isUrgent ? 'Urgent' : notice.isPublished ? 'Published' : 'Draft'}
                              </span>
                              <span className="ml-2 text-gray-400">
                                {formatDate(notice.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No notices created yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Content Distribution Charts */}
          {!loading && (Object.keys(stats.contentByCategory).length > 0 || Object.keys(stats.contentBySemester).length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Content by Category */}
              {Object.keys(stats.contentByCategory).length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Content by Category</h2>
                  <div className="space-y-3">
                    {Object.entries(stats.contentByCategory).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{getCategoryDisplayName(category)}</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(count / stats.totalContent) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content by Semester */}
              {Object.keys(stats.contentBySemester).length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Content by Semester</h2>
                  <div className="space-y-3">
                    {Object.entries(stats.contentBySemester).map(([semester, count]) => (
                      <div key={semester} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{semester}</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(count / stats.totalContent) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
