'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BookOpen, 
  Clock, 
  ChevronRight,
  FileText,
  PenTool,
  Clipboard,
  FlaskConical
} from 'lucide-react';
import api from '@/lib/api';
import { getSemesterName } from '@/lib/utils';

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

export default function SemesterPage() {
  const params = useParams();
  const semesterId = params.id as string;
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get(`/subjects/semester/${semesterId}`);
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setError('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };

    if (semesterId) {
      fetchSubjects();
    }
  }, [semesterId]);

  const semester = parseInt(semesterId);
  const isValidSemester = semester >= 1 && semester <= 8;

  if (!isValidSemester) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Invalid Semester</h1>
            <p className="text-xl text-gray-600 mb-8">
              Please select a valid semester (1-8)
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
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
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-gray-700">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900">Semesters</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900">{getSemesterName(semester)}</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">
                {getSemesterName(semester)}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Explore subjects and study materials for {getSemesterName(semester).toLowerCase()}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{subjects.length}</div>
                <div className="text-sm text-gray-500">Subjects</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 text-xl mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Subjects Found</h2>
            <p className="text-gray-600 mb-8">
              Subjects for {getSemesterName(semester).toLowerCase()} are not available yet.
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <Link
                key={subject._id}
                href={`/semester/${semester}/subject/${subject.code}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 group-hover:scale-105 border border-gray-100 hover:border-blue-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{subject.code}</div>
                      <div className="text-sm text-gray-500 font-medium">{subject.creditHours} Credits</div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    {subject.name}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                      <Clock className="h-4 w-4 mr-3 text-blue-500" />
                      <span className="font-medium">{subject.lectureHours}h Lecture</span>
                      {subject.tutorialHours && subject.tutorialHours > 0 && (
                        <span className="text-gray-400 mx-2">•</span>
                      )}
                      {subject.tutorialHours && subject.tutorialHours > 0 && (
                        <span className="font-medium">{subject.tutorialHours}h Tutorial</span>
                      )}
                    </div>
                    {subject.labHours && subject.labHours > 0 && (
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                        <FlaskConical className="h-4 w-4 mr-3 text-purple-500" />
                        <span className="font-medium">{subject.labHours}h Lab</span>
                      </div>
                    )}
                  </div>

                  {subject.description && (
                    <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {subject.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        Notes
                      </span>
                      <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center">
                        <PenTool className="h-3 w-3 mr-1" />
                        Papers
                      </span>
                      <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center">
                        <Clipboard className="h-3 w-3 mr-1" />
                        More
                      </span>
                    </div>
                    <div className="bg-blue-100 group-hover:bg-blue-200 rounded-full p-2 transition-colors">
                      <ChevronRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Other Semesters */}
        {!loading && subjects.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Explore Other Semesters
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].filter(sem => sem !== semester).map((sem) => (
                <Link
                  key={sem}
                  href={`/semester/${sem}`}
                  className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Sem {sem}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {sem === 1 ? '1st' : sem === 2 ? '2nd' : sem === 3 ? '3rd' : `${sem}th`} Semester
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
