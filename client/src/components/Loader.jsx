import React from "react";
import { Loader2 } from "lucide-react";

export default function Loader({ show, message = "Loading, please wait..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-3 max-w-xs w-full mx-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
          {message}
        </p>
      </div>
    </div>
  );
}