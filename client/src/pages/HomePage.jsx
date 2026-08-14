import React, { useState, useEffect } from "react";
import { BookOpen, FolderCheck, Search, Plus, FileCode2 } from "lucide-react";

// Components Import
import HeroBanner from "../components/HeroBanner";
import StatCard from "../components/StatCard";
import SubjectCard from "../components/SubjectCard";
import RecentCodeItem from "../components/RecentCodeItem";
import AddSubjectModal from "../components/AddSubjectModal";
import AddQuestionModal from "../components/AddQuestionModal";

// --- DUMMY DATA ---
const INITIAL_SUBJECTS = [
  { id: "1", name: "Data Structures & Algorithms", programsCount: 12 },
  { id: "2", name: "Object Oriented Programming", programsCount: 8 },
  { id: "3", name: "Computer Architecture", programsCount: 6 },
];

const ALL_RECENT_CODES = [
  { id: "p1", title: "Operator Overloading in C++", subject: "Object Oriented Programming", date: "Aug 13, 2026" },
  { id: "p2", title: "Binary Search Tree Implementation", subject: "Data Structures & Algorithms", date: "Aug 12, 2026" },
  { id: "p3", title: "Dijkstra's Algorithm", subject: "Data Structures & Algorithms", date: "Aug 10, 2026" },
  { id: "p4", title: "Virtual Functions Example", subject: "Object Oriented Programming", date: "Aug 09, 2026" },
  { id: "p5", title: "8086 Assembly Array Addition", subject: "Computer Architecture", date: "Aug 08, 2026" },
];

export default function HomePage({
  subjects = INITIAL_SUBJECTS,
  recentCodes = ALL_RECENT_CODES,
  onSelectSubject,
  onSelectCode,
  onAddSubjectSubmit,
  onAddQuestionSubmit
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const totalSubjects = subjects.length;
  const totalPrograms = subjects.reduce((acc, curr) => acc + (curr.programsCount || 0), 0);

  // Close modals on Escape key
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

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
      {/* Hero Banner */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onSelect={onSelectSubject}
          />
        ))}
      </div>

      {/* Recent Codes Section */}
      {recentCodes && recentCodes.length > 0 && (
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

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentCodes.map((code) => (
              <RecentCodeItem
                key={code.id}
                code={code}
                onSelect={onSelectCode}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddSubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSubmit={onAddSubjectSubmit}
      />

      <AddQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        subjects={subjects}
        onSubmit={onAddQuestionSubmit}
      />
    </div>
  );
}