import React from "react";
import { Code2, Clock, ChevronRight } from "lucide-react";

export default function RecentCodeItem({ code, onSelect }) {
  
  return (
    <div
      onClick={() => onSelect && onSelect(code.id)}
      className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 px-2 rounded-lg transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3 truncate">
        {code.rawQuestion.experimentNo !== null && code.rawQuestion.experimentNo !== undefined && code.rawQuestion.experimentNo !== "" ? (
          <div className="px-2 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs shrink-0 border border-indigo-200 dark:border-indigo-900/50">
            EXP: {code.rawQuestion.experimentNo}
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0">
            <Code2 className="w-4 h-4" />
          </div>
        )}
        <div className="truncate">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {code.title}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
            {code.subject}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-1 text-[11px]">
          <Clock className="w-3 h-3" />
          <span>{code.date}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}