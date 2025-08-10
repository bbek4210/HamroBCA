'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Menu, 
  X, 
  User, 
  LogOut
} from 'lucide-react';

interface AdminNavbarProps {
  adminData?: {
    email: string;
  };
}

export default function AdminNavbar({ adminData }: AdminNavbarProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/admin/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HamroBCA</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Admin
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/content"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              Content
            </Link>
            <Link
              href="/admin/notices"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              Notices
            </Link>
            <Link
              href="/admin/subjects"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              Subjects
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* View Site */}
            <Link
              href="/"
              target="_blank"
              className="hidden md:block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors text-sm"
            >
              View Site
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm">{adminData?.email || 'Admin'}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Signed in as</p>
                    <p className="text-sm text-gray-600 truncate">{adminData?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200">
            <Link
              href="/admin/dashboard"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/content"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Content Management
            </Link>
            <Link
              href="/admin/notices"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Notices
            </Link>
            <Link
              href="/admin/subjects"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Subjects
            </Link>
            <Link
              href="/"
              target="_blank"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              View Site
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
