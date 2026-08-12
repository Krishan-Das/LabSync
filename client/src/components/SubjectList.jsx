import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';

export default function SubjectList({ subjects, onSelectSubject, onAddSubject }) {
  if (!subjects || subjects.length === 0) {
    return (
      <div className="text-center py-10 px-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-md bg-gray-50/50 dark:bg-gray-900/50">
        <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">No subjects yet</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
          Create your first subject to start saving your lab work.
        </p>
        <button
          onClick={onAddSubject}
          className="inline-flex items-center space-x-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subject</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {subjects.map((subject) => (
        <button
          key={subject.id}
          onClick={() => onSelectSubject(subject.id)}
          className="w-full text-left p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/60 active:bg-gray-100 dark:active:bg-gray-800 transition-all flex items-center justify-between group"
        >
          <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate pr-2">
            {subject.name}
          </span>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
              {subject.count} {subject.count === 1 ? 'question' : 'questions'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      ))}
    </div>
  );
}