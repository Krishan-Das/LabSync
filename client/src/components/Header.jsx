import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom"; // useNavigate তুলে দেওয়া হয়েছে
import {
  FlaskConical,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  LogIn
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import LoginModal from "./LoginModal"; // 👈 ১. LoginModal ইমপোর্ট করুন (ফাইলের পাথ চেক করে নিবেন)

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 👈 ২. Modal এর স্টেট
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "US";

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Brand & Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600/10 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                Lab<span className="text-blue-600 dark:text-blue-400">Sync</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-0.5">
                Lab work, organized.
              </span>
            </div>
          </Link>

          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                type="button"
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                {/* User Avatar */}
                <div className="h-8 w-8 rounded-md bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
                  {initials}
                </div>

                {/* User Name & Role */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {user.email}
                  </span>
                </div>

                <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">

                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span>Profile</span>
                    </Link>

                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {theme === "dark" ? (
                          <Sun className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Moon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        )}
                        <span>Appearance</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {theme}
                      </span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleTheme}
                type="button"
                aria-label="Toggle theme"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              <button
                onClick={() => setIsLoginModalOpen(true)}
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Log in</span>
              </button>
            </div>
          )}

        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}