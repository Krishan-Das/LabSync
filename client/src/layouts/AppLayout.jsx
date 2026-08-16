import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Outlet Import করুন
import Header from "../components/Header";
import LoginModal from "../components/LoginModal";

export default function AppLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });

  const handleAuthSubmit = (userData, mode) => {
    setUser(userData);
    setIsLoggedIn(true);
    console.log(`User ${mode === "login" ? "logged in" : "registered"}:`, userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ name: "", email: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area - Outlet ব্যবহার করায় যেকোনো চাইল্ড পেজ (HomePage / PdfEditor) এখানে লোড হবে */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 py-6 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} LabSync. All rights reserved.</p>
          <p>Lab work, organized.</p>
        </div>
      </footer>

      {/* Login Popup Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onAuthSubmit={handleAuthSubmit}
      />
    </div>
  );
}