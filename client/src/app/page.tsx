'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BookOpen, 
  FileText, 
  PenTool, 
  Users, 
  Clock,
  Bell,
  TrendingUp,
  Search,
  ChevronRight
} from 'lucide-react';
import api from '@/lib/api';
import { formatDate, getSemesterName } from '@/lib/utils';

interface DashboardStats {
  totalContent: number;
  totalSubjects: number;
  recentContent: any[];
  urgentNotices: any[];
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    totalSubjects: 0,
    recentContent: [],
    urgentNotices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [contentRes, subjectsRes, noticesRes] = await Promise.all([
          api.get('/content?limit=6'),
          api.get('/subjects'),
          api.get('/notices/urgent')
        ]);

        setStats({
          totalContent: contentRes.data.pagination?.total || 0,
          totalSubjects: subjectsRes.data?.length || 0,
          recentContent: contentRes.data.content || [],
          urgentNotices: noticesRes.data || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const features = [
    {
      icon: FileText,
      title: 'Notes & Materials',
      description: 'Access comprehensive study notes for all BCA subjects',
      color: 'bg-blue-500'
    },
    {
      icon: PenTool,
      title: 'Past Papers',
      description: 'Access previous year question papers and solutions online',
      color: 'bg-green-500'
    },
    {
      icon: BookOpen,
      title: 'Handwritten Notes',
      description: 'High-quality handwritten notes from top students',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'Lab Reports',
      description: 'Complete lab reports and practical assignments',
      color: 'bg-orange-500'
    }
  ];

  const semesters = [
    { number: 1, subjects: 5, color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
    { number: 2, subjects: 5, color: 'bg-gradient-to-r from-green-400 to-green-600' },
    { number: 3, subjects: 5, color: 'bg-gradient-to-r from-purple-400 to-purple-600' },
    { number: 4, subjects: 6, color: 'bg-gradient-to-r from-pink-400 to-pink-600' },
    { number: 5, subjects: 5, color: 'bg-gradient-to-r from-indigo-400 to-indigo-600' },
    { number: 6, subjects: 6, color: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
    { number: 7, subjects: 5, color: 'bg-gradient-to-r from-red-400 to-red-600' },
    { number: 8, subjects: 4, color: 'bg-gradient-to-r from-gray-400 to-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">HamroBCA</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Your complete resource platform for BCA studies in Nepal. 
              Access notes, past papers, assignments, and more!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/semester/1"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                Browse Semesters
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/syllabus"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Syllabus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {loading ? '...' : stats.totalContent}
              </div>
              <div className="text-gray-600">Study Materials</div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {loading ? '...' : stats.totalSubjects}
              </div>
              <div className="text-gray-600">Subjects Covered</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {loading ? '...' : stats.totalContent}
              </div>
              <div className="text-gray-600">Content Items</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">Everything you need for your BCA studies</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className={`${feature.color} rounded-lg w-12 h-12 flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Semesters Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Semester</h2>
            <p className="text-xl text-gray-600">Select your semester to access relevant materials</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {semesters.map((semester) => (
              <Link
                key={semester.number}
                href={`/semester/${semester.number}`}
                className="group"
              >
                <div className={`${semester.color} rounded-lg p-6 text-white hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                  <div className="text-2xl font-bold mb-2">Semester {semester.number}</div>
                  <div className="text-sm opacity-90">{semester.subjects} Subjects</div>
                  <div className="mt-4 flex items-center text-sm">
                    <span>View Materials</span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Content & Notices */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Content */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Materials</h2>
                <Link
                  href="/content"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))
                ) : (
                  stats.recentContent.map((item: any) => (
                    <div key={item._id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600">
                            {getSemesterName(item.semester)} • {item.subjectCode}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(item.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FileText className="h-4 w-4 mr-1" />
                          {item.category?.replace('_', ' ') || 'Content'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Urgent Notices */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Important Notices</h2>
                <Link
                  href="/notices"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))
                ) : stats.urgentNotices.length > 0 ? (
                  stats.urgentNotices.map((notice: any) => (
                    <Link
                      key={notice._id}
                      href={`/notices/${notice._id}`}
                      className="block"
                    >
                      <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-red-500">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center mb-2">
                              <Bell className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
                                {notice.isUrgent ? 'Urgent' : notice.type}
                              </span>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">{notice.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notice.content.substring(0, 100)}...
                            </p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(notice.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No urgent notices at the moment</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}