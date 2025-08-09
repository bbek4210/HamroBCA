'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BookOpen, 
  Clock, 
  Users, 
  ChevronRight,
  Download,
  FlaskConical,
  GraduationCap
} from 'lucide-react';
import api from '@/lib/api';

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

export default function SyllabusPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/subjects');
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const groupedSubjects = subjects.reduce((acc, subject) => {
    if (!acc[subject.semester]) {
      acc[subject.semester] = [];
    }
    acc[subject.semester].push(subject);
    return acc;
  }, {} as Record<number, Subject[]>);

  const totalCredits = subjects.reduce((sum, subject) => sum + subject.creditHours, 0);
  const totalSubjects = subjects.length;

  const semesterColors = [
    '', // 0 index placeholder
    'bg-blue-50 border-blue-200',
    'bg-green-50 border-green-200',
    'bg-purple-50 border-purple-200',
    'bg-pink-50 border-pink-200',
    'bg-indigo-50 border-indigo-200',
    'bg-yellow-50 border-yellow-200',
    'bg-red-50 border-red-200',
    'bg-gray-50 border-gray-200'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 rounded-full p-4">
                <GraduationCap className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              BCA Syllabus
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Complete curriculum structure for Bachelor of Computer Applications (BCA) program in Nepal
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{totalSubjects}</div>
                <div className="text-gray-600">Total Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{totalCredits}</div>
                <div className="text-gray-600">Total Credits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
                <div className="text-gray-600">Semesters</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Computer Application (Core Courses)</span>
                  <span className="font-medium">71 Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mathematics and Statistics Courses</span>
                  <span className="font-medium">9 Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language Courses</span>
                  <span className="font-medium">6 Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Social Science and Management Courses</span>
                  <span className="font-medium">15 Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Elective Courses</span>
                  <span className="font-medium">12 Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Project and Internships</span>
                  <span className="font-medium">13 Credits</span>
                </div>
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Credit Hours</span>
                    <span className="text-blue-600">126</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Highlights</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Comprehensive computer application curriculum</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Strong foundation in programming and software development</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Practical lab sessions and project work</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Industry-relevant elective courses</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Mandatory internship for practical experience</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Semester Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Semester-wise Curriculum</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedSemester(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSemester === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              All Semesters
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSemester === sem
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Semester {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects by Semester */}
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(j => (
                    <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSubjects)
              .filter(([semester]) => selectedSemester === null || parseInt(semester) === selectedSemester)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([semester, semesterSubjects]) => {
                const semesterNum = parseInt(semester);
                const semesterCredits = semesterSubjects.reduce((sum, subject) => sum + subject.creditHours, 0);
                
                return (
                  <div
                    key={semester}
                    className={`bg-white rounded-lg shadow-sm border-l-4 ${semesterColors[semesterNum]} overflow-hidden`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Semester {semester}
                          </h3>
                          <p className="text-gray-600">
                            {semesterSubjects.length} subjects • {semesterCredits} credits
                          </p>
                        </div>
                        <Link
                          href={`/semester/${semester}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          View Materials
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Course Code</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Course Title</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-900">Credit Hrs.</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-900">Lecture Hrs.</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-900">Tutorial Hrs.</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-900">Lab Hrs.</th>
                            </tr>
                          </thead>
                          <tbody>
                            {semesterSubjects.map((subject, index) => (
                              <tr
                                key={subject._id}
                                className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                              >
                                <td className="py-3 px-4 font-medium text-blue-600">
                                  <Link
                                    href={`/semester/${semester}/subject/${subject.code}`}
                                    className="hover:underline"
                                  >
                                    {subject.code}
                                  </Link>
                                </td>
                                <td className="py-3 px-4">
                                  <Link
                                    href={`/semester/${semester}/subject/${subject.code}`}
                                    className="text-gray-900 hover:text-blue-600 hover:underline"
                                  >
                                    {subject.name}
                                  </Link>
                                </td>
                                <td className="py-3 px-4 text-center">{subject.creditHours}</td>
                                <td className="py-3 px-4 text-center">{subject.lectureHours}</td>
                                <td className="py-3 px-4 text-center">{subject.tutorialHours || '–'}</td>
                                <td className="py-3 px-4 text-center">{subject.labHours || '–'}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t-2 border-gray-300 font-semibold">
                              <td colSpan={2} className="py-3 px-4">Total</td>
                              <td className="py-3 px-4 text-center">{semesterCredits}</td>
                              <td className="py-3 px-4 text-center">
                                {semesterSubjects.reduce((sum, s) => sum + s.lectureHours, 0)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {semesterSubjects.reduce((sum, s) => sum + (s.tutorialHours || 0), 0)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {semesterSubjects.reduce((sum, s) => sum + (s.labHours || 0), 0)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
