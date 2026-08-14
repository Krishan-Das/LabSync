import React from "react";

export default function StatCard({ icon: Icon, iconBgClass, iconTextClass, label, value }) {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
      <div className={`p-3 rounded-lg ${iconBgClass} ${iconTextClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}