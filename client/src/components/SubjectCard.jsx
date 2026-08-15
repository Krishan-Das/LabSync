import React from "react";
import { ArrowUpRight, Trash2 } from "lucide-react";

export default function SubjectCard({ subject, onSelect, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(subject);
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(subject)}
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer min-h-[140px]"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {subject.name}
          </h3>

          {/* 🔴 Delete Button */}
          <button
            onClick={handleDelete}
            title="Delete Subject"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          {subject.programsCount || 0} {subject.programsCount === 1 ? "program" : "programs"}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end text-xs font-semibold text-blue-600 dark:text-blue-400 mt-4">
        <div className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>View Subject</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}