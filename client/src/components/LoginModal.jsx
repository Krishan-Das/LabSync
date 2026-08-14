import React, { useState, useContext } from "react";
import { X, LogIn, UserPlus, FlaskConical, Mail, Lock, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext"; // Path চেক করে নিবেন

export default function LoginModal({ isOpen, onClose }) {
  const { login, register } = useContext(AuthContext);

  // 'login' or 'signup' mode
  const [mode, setMode] = useState("login");

  // Form & UI States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        // Login Call
        const res = await login({ email, password });
        if (res?.success) {
          toast.success(res.message || "Logged in successfully!");
          resetAndClose();
        } else {
          toast.error(res?.message || "Invalid email or password");
        }
      } else {
        // Register Call
        const res = await register({ name, email, password });
        if (res?.success) {
          toast.success(res.message || "Account created successfully!");
          resetAndClose();
        } else {
          toast.error(res?.message || "Registration failed");
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    setIsSubmitting(false);
    onClose();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-blue-600/10 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === "login"
              ? "Log in to access your lab programs and code outputs"
              : "Start organizing your college lab programs with LabSync"}
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Full Name Field (Only in Sign Up Mode) */}
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="Alex Student"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all disabled:opacity-50"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                disabled={isSubmitting}
                placeholder="alex@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all disabled:opacity-50"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                disabled={isSubmitting}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all disabled:opacity-50"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full !mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium transition-all shadow-sm hover:shadow active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === "login" ? "Logging in..." : "Creating Account..."}</span>
              </>
            ) : mode === "login" ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log in to LabSync</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Bottom Mode Switcher Link */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => switchMode("signup")}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
              >
                Create account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => switchMode("login")}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
              >
                Log in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}