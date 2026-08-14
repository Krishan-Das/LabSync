import React, { useState } from "react";
import { FolderPlus, X, Plus } from "lucide-react";

export default function AddSubjectModal({ isOpen, onClose, onSubmit }) {
  const [subjectName, setSubjectName] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = subjectName.trim();

    if (!trimmedName) {
      setSubjectError("Subject name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setSubjectError("Subject name cannot exceed 100 characters.");
      return;
    }

    setIsSubmitting(true);
    const newSubjectPayload = {
      name: trimmedName,
      normalizedName: trimmedName.toLowerCase().replace(/\s+/g, " "),
    };

    if (onSubmit) onSubmit(newSubjectPayload);
    setIsSubmitting(false);
    setSubjectName("");
    setSubjectError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add New Subject
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a subject folder for organizing programs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Operating Systems"
              maxLength={100}
              value={subjectName}
              onChange={(e) => {
                setSubjectName(e.target.value);
                if (subjectError) setSubjectError("");
              }}
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all"
            />
            <div className="flex justify-between items-center pt-0.5">
              {subjectError ? (
                <p className="text-[11px] font-medium text-red-500">{subjectError}</p>
              ) : (
                <span />
              )}
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {subjectName.length}/100
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium transition-all shadow-sm disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Creating..." : "Create Subject"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}