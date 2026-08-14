import React, { useState, useEffect } from "react";
import { BookOpen, FolderCheck, Search, Plus, FileCode2, Inbox } from "lucide-react";
import toast from "react-hot-toast";

// Components Import
import HeroBanner from "../components/HeroBanner";
import StatCard from "../components/StatCard";
import SubjectCard from "../components/SubjectCard";
import RecentCodeItem from "../components/RecentCodeItem";
import AddSubjectModal from "../components/AddSubjectModal";
import AddQuestionModal from "../components/AddQuestionModal";
import QuestionDetailsPage from "./QuestionDetailsPage";
import SubjectPage from "./SubjectPage";
import axiosInstance from "../api/axiosInstance";

import { useLoader } from "../context/LoaderContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HomePage({ onSelectSubject, onSelectCode }) {
  const [subjects, setSubjects] = useState([]);
  const [recentCodes, setRecentCodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const { showLoader, hideLoader } = useLoader();

  const fetchData = async () => {
    showLoader("Fetching subjects and questions...");
    try {
      const [subjectsRes, questionsRes] = await Promise.all([
        axiosInstance.get(`${API_BASE_URL}/api/subject`),
        axiosInstance.get(`${API_BASE_URL}/api/question`),
      ]);

      const fetchedSubjects = subjectsRes.data?.subjects || [];
      const fetchedQuestions = questionsRes.data?.questions || [];

      // Calculate programsCount per subject
      const subjectsWithCount = fetchedSubjects.map((sub) => {
        const count = fetchedQuestions.filter(
          (q) => (q.subjectId?._id || q.subjectId) === sub._id
        ).length;
        return {
          ...sub,
          id: sub._id,
          programsCount: count,
        };
      });

      const formattedRecentCodes = fetchedQuestions.slice(0, 5).map((q) => ({
        id: q._id,
        title: q.question,
        subject: q.subjectId?.name || "General",
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

      setSubjects(subjectsWithCount);
      setRecentCodes(formattedRecentCodes);
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      toast.error(error.response?.data?.message || "Failed to load subjects and questions");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Keyboard shortcut listener for Modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSubjectModalOpen(false);
        setIsQuestionModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handlers for Modals
  const handleAddSubjectSubmit = async (formData) => {
    showLoader("Adding new subject...");
    try {
      const res = await axiosInstance.post(`${API_BASE_URL}/api/subject`, formData);
      if (res.data?.success) {
        toast.success(res.data.message || "Subject added!");
        setIsSubjectModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add subject");
    } finally {
      hideLoader();
    }
  };

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
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add question");
    } finally {
      hideLoader();
    }
  };

  const handleCardSelectSubject = (subject) => {
    if (onSelectSubject) {
      onSelectSubject(subject);
    }
    setSelectedSubject(subject);
  };

  const totalSubjects = subjects.length;
  const totalPrograms = subjects.reduce((acc, curr) => acc + (curr.programsCount || 0), 0);

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. Question Details Page Priority
  if (selectedQuestionId) {
    return (
      <QuestionDetailsPage
        questionId={selectedQuestionId}
        onBack={() => setSelectedQuestionId(null)}
      />
    );
  }

  // 2. Subject Page Priority
  if (selectedSubject) {
    return (
      <SubjectPage
        subject={selectedSubject}
        onBack={() => {
          setSelectedSubject(null);
          fetchData(); // 🟢 ব্যাক করলে হোমপেজের ডেটা আপডেট হবে
        }}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
      <HeroBanner />

      {/* Analytics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon={BookOpen}
          iconBgClass="bg-blue-50 dark:bg-blue-950/50"
          iconTextClass="text-blue-600 dark:text-blue-400"
          label="Total Subjects"
          value={totalSubjects}
        />
        <StatCard
          icon={FolderCheck}
          iconBgClass="bg-emerald-50 dark:bg-emerald-950/50"
          iconTextClass="text-emerald-600 dark:text-emerald-400"
          label="Total Programs"
          value={totalPrograms}
        />
      </div>

      {/* Search & Action Control */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all shadow-xs"
          />
        </div>

        <button
          onClick={() => setIsSubjectModalOpen(true)}
          type="button"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject._id}
              subject={subject}
              onSelect={handleCardSelectSubject}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
          <Inbox className="w-10 h-10 text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {searchQuery ? "No subjects match your search" : "No subjects added yet"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery ? "Try searching with another keyword" : "Click 'Add Subject' to get started"}
          </p>
        </div>
      )}

      {/* Recent Codes Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Recent Codes & Questions
              </h2>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              Latest program submissions across all subjects
            </p>
          </div>

          <button
            onClick={() => setIsQuestionModalOpen(true)}
            type="button"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium transition-all shadow-xs self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        {recentCodes.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentCodes.map((code) => (
              <RecentCodeItem
                key={code.id}
                code={code}
                onSelect={() => setSelectedQuestionId(code.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No recent programs found. Click 'Add Question' to add one!
          </div>
        )}
      </div>

      {/* Modals */}
      <AddSubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSubmit={handleAddSubjectSubmit}
      />

      <AddQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        subjects={subjects}
        onSubmit={handleAddQuestionSubmit}
      />
    </div>
  );
}