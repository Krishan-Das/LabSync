import React, { useState, useEffect } from "react";
import { HelpCircle, X, Trash2, ImageIcon, Plus } from "lucide-react";

export default function AddQuestionModal({ isOpen, onClose, subjects = [], onSubmit }) {
  const [formData, setFormData] = useState({
    subjectId: subjects.length > 0 ? subjects[0].id : "",
    question: "",
    code: "",
    labDate: new Date().toISOString().split("T")[0],
    opsUrl: "",
    opsFileId: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [questionError, setQuestionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subjects.length > 0 && !formData.subjectId) {
      setFormData((prev) => ({ ...prev, subjectId: subjects[0].id }));
    }
  }, [subjects]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setQuestionError("Please upload a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          opsUrl: reader.result,
          opsFileId: file.name
        }));
      };
      reader.readAsDataURL(file);
      setQuestionError("");
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, opsUrl: "", opsFileId: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.subjectId) {
      setQuestionError("Please select a subject.");
      return;
    }

    if (!formData.question.trim()) {
      setQuestionError("Question field is required.");
      return;
    }

    if (formData.question.trim().length > 500) {
      setQuestionError("Question cannot exceed 500 characters.");
      return;
    }

    if (!formData.labDate) {
      setQuestionError("Lab date is required.");
      return;
    }

    setIsSubmitting(true);

    const newQuestionPayload = {
      subjectId: formData.subjectId,
      question: formData.question.trim(),
      code: formData.code.trim() || null,
      ops: {
        url: formData.opsUrl || null,
        fileId: formData.opsFileId || null
      },
      labDate: new Date(formData.labDate)
    };

    if (onSubmit) onSubmit(newQuestionPayload);

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 space-y-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add Lab Question
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Submit a question, full code snippet, and output screenshot.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Lab Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.labDate}
                onChange={(e) => setFormData({ ...formData, labDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Question Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Write a C++ program to implement single inheritance..."
              maxLength={500}
              value={formData.question}
              onChange={(e) => {
                setFormData({ ...formData, question: e.target.value });
                if (questionError) setQuestionError("");
              }}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Describe the question statement clearly.</span>
              <span>{formData.question.length}/500</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Source Code <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Expanded preview editor</span>
            </div>
            <textarea
              rows={8}
              placeholder="// Paste your full program source code here..."
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full min-h-[220px] p-4 font-mono text-xs sm:text-sm leading-relaxed rounded-lg bg-slate-900 text-slate-100 border border-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Execution Output Screenshot <span className="text-slate-400 font-normal">(Optional)</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 group">
                <img
                  src={imagePreview}
                  alt="Output Screenshot Preview"
                  className="w-full max-h-56 object-contain p-2"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 px-4 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 cursor-pointer transition-all">
                <div className="flex flex-col items-center justify-center text-center space-y-1">
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Click to upload code output screenshot
                  </p>
                  <p className="text-[10px] text-slate-400">PNG, JPG or WEBP formats</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {questionError && (
            <p className="text-xs font-medium text-red-500">{questionError}</p>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
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
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium transition-all shadow-sm disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Adding..." : "Add Question"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}