import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Search, User, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header({ searchQuery, setSearchQuery }) {
  // Context থেকে theme এবং auth স্টেট নিয়ে আসা হচ্ছে
  const { isDarkMode, toggleTheme, user, logout } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-7 h-7 bg-indigo-600 dark:bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-xs shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-gray-900 dark:text-gray-100">
            LabSync
          </span>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-lg hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search your lab questions..."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 pl-9 pr-4 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              {user ? user.name.split(' ').map((n) => n[0]).join('') : <User className="w-4 h-4" />}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-md py-1 z-40 text-xs">
                <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-800 font-medium text-gray-900 dark:text-gray-100">
                  {user ? user.name : 'Guest User'}
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2"
                >
                  <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2"
                >
                  <Settings className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  <span>Settings</span>
                </button>
                <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}