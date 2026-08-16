import React, { useState, useEffect } from "react";
import { X, CheckCircle, Image as ImageIcon, Loader2, FolderOpen, Search, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

export default function SavedQuestionsModal({ isOpen, onClose, onImport }) {
  const [questions, setQuestions] = useState([]);
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
      setSelectedUrls([]);
      setSearchTerm("");
      setSelectedSubject("ALL");
    }
  }, [isOpen]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/question");
      const data = res.data;

      if (data.success && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        toast.error(data.message || "Failed to load saved questions");
      }
    } catch (error) {
      console.error("Fetch questions error:", error);
      toast.error(error.response?.data?.message || "Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (url) => {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  };

  const subjects = ["ALL", ...new Set(questions.map((q) => q.subjectId?.name || "General"))];

  const filteredQuestions = questions.filter((q) => {
    const subName = q.subjectId?.name || "General";
    const matchesSubject = selectedSubject === "ALL" || subName === selectedSubject;
    const matchesSearch =
      q.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleImport = () => {
    if (selectedUrls.length === 0) {
      toast.error("Please select at least one program screenshot");
      return;
    }
    onImport(selectedUrls);
    toast.success(`Successfully imported ${selectedUrls.length} screenshot(s)`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Select Program & Output Screenshots
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose subject-wise saved programs to import their execution outputs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search Bar */}
        <div className="px-6 pt-4 pb-2 flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubject === sub
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search program title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-600" />
              <p className="text-xs font-medium">Loading subject programs...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No programs found</p>
              <p className="text-xs text-slate-400 mt-1">Try changing the subject filter or search keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredQuestions.map((q) => {
                const imageUrl = q.ops?.url;
                const isSelected = selectedUrls.includes(imageUrl);
                const subName = q.subjectId?.name || "General";

                return (
                  <div
                    key={q._id}
                    onClick={() => imageUrl && toggleSelect(imageUrl)}
                    className={`relative group rounded-xl border-2 p-3 cursor-pointer transition-all duration-150 flex flex-col justify-between bg-slate-50 dark:bg-slate-800/40 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 truncate max-w-[150px]">
                        <BookOpen className="w-3 h-3" />
                        {subName}
                      </span>
                      {imageUrl && (
                        <CheckCircle
                          className={`w-5 h-5 transition-transform ${
                            isSelected
                              ? "text-blue-600 fill-blue-600/10 scale-110"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      )}
                    </div>

                    <div className="w-full h-32 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-2.5 border border-slate-200 dark:border-slate-700">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={q.question || "Program"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 px-2 text-center">No Output Screenshot</span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 px-0.5" title={q.question}>
                      {q.question || "Untitled Program"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Selected: <strong className="text-blue-600 dark:text-blue-400">{selectedUrls.length}</strong> program(s)
          </span>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={selectedUrls.length === 0}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              Import Selected ({selectedUrls.length})
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}