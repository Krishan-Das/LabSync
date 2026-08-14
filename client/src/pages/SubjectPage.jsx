import React, { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Search, Plus, FileCode2, Inbox } from "lucide-react";
import toast from "react-hot-toast";

// Components & Context Imports
import RecentCodeItem from "../components/RecentCodeItem";
import AddQuestionModal from "../components/AddQuestionModal";
import QuestionDetailsPage from "./QuestionDetailsPage";
import axiosInstance from "../api/axiosInstance";
import { useLoader } from "../context/LoaderContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SubjectPage({ subject, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const { showLoader, hideLoader } = useLoader();

  const fetchSubjectQuestions = async () => {
    showLoader(`Loading questions for ${subject?.name || "Subject"}...`);
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/api/question`);
      const allQuestions = res.data?.questions || [];

      // Filter questions matching current subject ID safely
      const targetSubjectId = subject?._id || subject?.id;
      const subjectQuestions = allQuestions.filter(
        (q) => (q.subjectId?._id || q.subjectId) === targetSubjectId
      );

      const formattedQuestions = subjectQuestions.map((q) => ({
        id: q._id,
        title: q.question,
        subject: q.subjectId?.name || subject?.name,
        date: q.labDate
          ? new Date(q.labDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : new Date(q.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
        rawQuestion: q,
      }));

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error("Error fetching subject questions:", error);
      toast.error(error.response?.data?.message || "Failed to load questions");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (subject) {
      fetchSubjectQuestions();
    }
  }, [subject]);

  const handleAddQuestionSubmit = async (formData) => {
    showLoader("Adding new question & code...");
    try {
      const res = await axiosInstance.post(`${API_BASE_URL}/api/question`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data?.success) {
        toast.success(res.data.message || "Question added!");
        setIsQuestionModalOpen(false);
        fetchSubjectQuestions();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add question");
    } finally {
      hideLoader();
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If a question inside subject page is clicked
  if (selectedQuestionId) {
    return (
      <QuestionDetailsPage
        questionId={selectedQuestionId}
        onBack={() => setSelectedQuestionId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative pb-10">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Subject Banner / Header Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {subject?.name}
              </h1>
              {subject?.code && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono">
                  {subject.code}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
              All laboratory questions and programs under this subject
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <FileCode2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>
            <strong>{questions.length}</strong> {questions.length === 1 ? "Program" : "Programs"} Total
          </span>
        </div>
      </div>

      {/* Search & Action Control */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={`Search questions in ${subject?.name || "subject"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all shadow-xs"
          />
        </div>

        <button
          onClick={() => setIsQuestionModalOpen(true)}
          type="button"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        {filteredQuestions.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredQuestions.map((code) => (
              <RecentCodeItem
                key={code.id}
                code={code}
                onSelect={() => setSelectedQuestionId(code.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="w-10 h-10 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {searchQuery ? "No questions match your search" : "No questions found for this subject"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery ? "Try searching with another keyword" : "Click 'Add Question' to add the first program"}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AddQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        subjects={subject ? [subject] : []}
        onSubmit={handleAddQuestionSubmit}
      />
    </div>
  );
}