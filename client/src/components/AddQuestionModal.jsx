import React, { useState, useEffect } from "react";
import { HelpCircle, X, Trash2, ImageIcon } from "lucide-react";

export default function AddQuestionModal({ isOpen, onClose, subjects = [], onSubmit }) {
  // MongoDB id support (_id || id)
  const getSubjectId = (sub) => sub?._id || sub?.id || "";

  const [formData, setFormData] = useState({
    subjectId: subjects.length > 0 ? getSubjectId(subjects[0]) : "",
    experimentNo: "",
    question: "",
    code: "",
    labDate: new Date().toISOString().split("T")[0],
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [questionError, setQuestionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subjects asle ba change hole prothom ta default select kore nibe
  useEffect(() => {
    if (subjects.length > 0 && !formData.subjectId) {
      setFormData((prev) => ({ ...prev, subjectId: getSubjectId(subjects[0]) }));
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
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setQuestionError("");
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subjectId) {
      setQuestionError("Please select a subject.");
      return;
    }

    if (!formData.question.trim()) {
      setQuestionError("Question field is required.");
      return;
    }

    setIsSubmitting(true);

    const submissionData = new FormData();

    submissionData.append("subjectId", formData.subjectId);
    submissionData.append("question", formData.question.trim());
    submissionData.append("code", formData.code.trim() || "");
    submissionData.append("labDate", formData.labDate);

    if (formData.experimentNo) {
      submissionData.append("experimentNo", formData.experimentNo);
    }

    if (selectedFile) {
      submissionData.append("ops", selectedFile);
    }

    if (onSubmit) {
      await onSubmit(submissionData);
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 space-y-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add Lab Question</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject, Experiment No & Lab Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Subject Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Subject *</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
              >
                {subjects.length > 0 ? (
                  subjects.map((sub) => {
                    const sId = getSubjectId(sub);
                    return (
                      <option key={sId} value={sId}>
                        {sub.name}
                      </option>
                    );
                  })
                ) : (
                  <option value="" disabled>No subjects available</option>
                )}
              </select>
            </div>

            {/* Experiment Number Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Experiment No</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 0, 1, 2..."
                value={formData.experimentNo}
                onChange={(e) => setFormData({ ...formData, experimentNo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
              />
            </div>

            {/* Lab Date Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Lab Date *</label>
              <input
                type="date"
                value={formData.labDate}
                onChange={(e) => setFormData({ ...formData, labDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Question *</label>
            <textarea
              rows={3}
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
              placeholder="Write your question here..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Source Code</label>
            <textarea
              rows={6}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full p-4 font-mono text-xs rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
              placeholder="// Write or paste your code here..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Screenshot</label>
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                <img src={imagePreview} alt="Preview" className="w-full max-h-56 object-contain p-2" />
                <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs text-slate-500">Upload Screenshot</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          {questionError && <p className="text-xs text-red-500 font-medium">{questionError}</p>}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50">
              {isSubmitting ? "Adding..." : "Add Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}