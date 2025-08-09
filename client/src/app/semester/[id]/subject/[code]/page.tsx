'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BookOpen, 
  Download, 
  FileText, 
  PenTool, 
  Clipboard,
  FlaskConical,
  Clock,
  ChevronRight,
  Filter,
  Search,
  Eye,
  Calendar
} from 'lucide-react';
import ContentViewer from '@/components/ContentViewer';
import api from '@/lib/api';
import { formatDate, formatFileSize, getCategoryDisplayName, getSemesterName } from '@/lib/utils';

interface Subject {
  _id: string;
  name: string;
  code: string;
  semester: number;
  creditHours: number;
  lectureHours: number;
  tutorialHours?: number;
  labHours?: number;
  description?: string;
}

interface Content {
  _id: string;
  title: string;
  description?: string;
  category: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  downloadCount: number;
  tags: string[];
  chapter?: string;
  unit?: string;
  createdAt: string;
}

const categoryIcons: Record<string, any> = {
  notes: FileText,
  past_papers: PenTool,
  handwritten_notes: BookOpen,
  important_questions: Clipboard,
  assignments: Clipboard,
  lab_reports: FlaskConical,
  syllabus: BookOpen,
  reference_materials: FileText
};

const categoryColors: Record<string, string> = {
  notes: 'bg-blue-100 text-blue-800',
  past_papers: 'bg-green-100 text-green-800',
  handwritten_notes: 'bg-purple-100 text-purple-800',
  important_questions: 'bg-orange-100 text-orange-800',
  assignments: 'bg-pink-100 text-pink-800',
  lab_reports: 'bg-indigo-100 text-indigo-800',
  syllabus: 'bg-yellow-100 text-yellow-800',
  reference_materials: 'bg-gray-100 text-gray-800'
};

export default function SubjectPage() {
  const params = useParams();
  const semesterId = params.id as string;
  const subjectCode = params.code as string;
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [groupedContent, setGroupedContent] = useState<Record<string, Content[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewerContent, setViewerContent] = useState<Content | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectRes, contentRes] = await Promise.all([
          api.get(`/subjects/${subjectCode}`),
          api.get(`/content/semester/${semesterId}/subject/${subjectCode}`)
        ]);

        setSubject(subjectRes.data);
        setContent(contentRes.data.content || []);
        setGroupedContent(contentRes.data.groupedContent || {});
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load subject data');
      } finally {
        setLoading(false);
      }
    };

    if (semesterId && subjectCode) {
      fetchData();
    }
  }, [semesterId, subjectCode]);

  const handleView = (item: Content) => {
    setViewerContent(item);
    setIsViewerOpen(true);
  };

  const handleDownload = async (contentId: string, fileName: string) => {
    try {
      const response = await api.get(`/content/${contentId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Update download count in UI
      setContent(prev => prev.map(item => 
        item._id === contentId 
          ? { ...item, downloadCount: item.downloadCount + 1 }
          : item
      ));
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const filteredContent = content.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const categories = Object.keys(groupedContent);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Subject Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">{error || 'The requested subject could not be found.'}</p>
            <Link
              href={`/semester/${semesterId}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Semester
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center space-x-2 text-sm text-blue-100 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/semester/${semesterId}`} className="hover:text-white transition-colors">
              {getSemesterName(subject.semester)}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">{subject.code}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-6 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{subject.name}</h1>
                  <p className="text-xl text-blue-100 font-medium">{subject.code} • {subject.creditHours} Credits</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-blue-100 mb-6">
                <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  {subject.lectureHours}h Lecture
                </div>
                {subject.tutorialHours && subject.tutorialHours > 0 && (
                  <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                    <Clock className="h-4 w-4 mr-2" />
                    {subject.tutorialHours}h Tutorial
                  </div>
                )}
                {subject.labHours && subject.labHours > 0 && (
                  <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                    <FlaskConical className="h-4 w-4 mr-2" />
                    {subject.labHours}h Lab
                  </div>
                )}
              </div>

              {subject.description && (
                <p className="text-blue-50 text-lg leading-relaxed mb-6 max-w-3xl">{subject.description}</p>
              )}
            </div>

            <div className="lg:ml-8 mt-6 lg:mt-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center min-w-[200px]">
                <div className="text-4xl font-bold text-white mb-2">{content.length}</div>
                <div className="text-blue-100 text-lg">Study Materials</div>
                <div className="text-blue-200 text-sm mt-1">Available Resources</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-4 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({content.length})
              </button>
              {categories.map(category => {
                const Icon = categoryIcons[category] || FileText;
                const count = groupedContent[category]?.length || 0;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {getCategoryDisplayName(category)} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search materials..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Materials Found</h2>
            <p className="text-gray-600">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No study materials are available for this subject yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContent.map((item) => {
              const Icon = categoryIcons[item.category] || FileText;
              const categoryColor = categoryColors[item.category] || 'bg-gray-100 text-gray-800';
              
              return (
                <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
                      {getCategoryDisplayName(item.category)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>

                  <div className="flex-grow">
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {item.chapter && (
                      <div className="bg-blue-50 rounded-lg px-3 py-2 mb-4">
                        <div className="text-xs font-medium text-blue-800">
                          📚 {item.chapter}
                        </div>
                      </div>
                    )}

                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-lg font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{item.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(item.createdAt)}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Eye className="h-4 w-4 mr-1" />
                          {item.downloadCount} views
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500">File Size</div>
                        <div className="font-medium text-gray-700">{formatFileSize(item.fileSize)}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleView(item)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center font-semibold text-sm shadow-lg hover:shadow-xl"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Content
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {/* Content Viewer Modal */}
      {viewerContent && (
        <ContentViewer
          content={viewerContent}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setViewerContent(null);
          }}

        />
      )}
    </div>
  );
}
