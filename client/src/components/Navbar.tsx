'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, BookOpen, Bell, Home } from 'lucide-react';

interface NavbarProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export default function Navbar({ onSearch, showSearch = true }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HamroBCA</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          {showSearch && (
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search notes, papers, subjects..."
                  />
                </div>
              </form>
            </div>
          )}

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            
            {/* Semester Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                Semesters
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                {semesters.map((sem) => (
                  <Link
                    key={sem}
                    href={`/semester/${sem}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    {sem === 1 ? '1st' : sem === 2 ? '2nd' : sem === 3 ? '3rd' : `${sem}th`} Semester
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/syllabus"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              Syllabus
            </Link>
            
            <Link
              href="/notices"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Bell className="h-4 w-4 mr-1" />
              Notices
            </Link>
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

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search notes, papers, subjects..."
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            
            {/* Mobile Semesters */}
            <div className="px-3 py-2 text-sm font-medium text-gray-500">Semesters</div>
            <div className="grid grid-cols-2 gap-1 px-3">
              {semesters.map((sem) => (
                <Link
                  key={sem}
                  href={`/semester/${sem}`}
                  className="px-2 py-1 text-sm text-gray-700 hover:text-blue-600 hover:bg-white rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Semester {sem}
                </Link>
              ))}
            </div>
            
            <Link
              href="/syllabus"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Syllabus
            </Link>
            
            <Link
              href="/notices"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notices
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
