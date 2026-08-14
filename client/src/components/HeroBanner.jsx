import React from "react";
import { Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-950 p-6 sm:p-8 text-white shadow-lg">
      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <Sparkles className="w-64 h-64 text-white" />
      </div>
      <div className="relative z-10 max-w-2xl space-y-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-blue-100 border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Lab Workspace
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Organize Your Lab Programs
        </h1>
        <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
          Manage your code, outputs, and lab notebook all in one clean place. Stay ahead with your coursework.
        </p>
      </div>
    </div>
  );
}