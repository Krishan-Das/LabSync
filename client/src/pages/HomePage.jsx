import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SubjectList from '../components/SubjectList';
import { Plus, Check, Code2, Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle .dark class on the <html> element for Tailwind's custom variant
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [subjects, setSubjects] = useState([
    { id: 'ds', name: 'Data Structure', count: 12 },
    { id: 'dbms', name: 'Database Management System', count: 8 },
    { id: 'os', name: 'Operating System', count: 6 },
  ]);

  const [recentQuestions] = useState([
    {
      id: 'q1',
      subjectId: 'ds',
      title: 'Implement Stack Using Array',
      subjectName: 'Data Structure',
      date: 'Aug 12, 2026',
      hasCode: true,
      hasOutput: true,
    },
    {
      id: 'q2',
      subjectId: 'ds',
      title: 'Reverse a Linked List',
      subjectName: 'Data Structure',
      date: 'Aug 10, 2026',
      hasCode: true,
      hasOutput: true,
    },
    {
      id: 'q3',
      subjectId: 'dbms',
      title: 'SQL Query for 2nd Highest Salary',
      subjectName: 'Database Management System',
      date: 'Aug 08, 2026',
      hasCode: true,
      hasOutput: false,
    },
    {
      id: 'q4',
      subjectId: 'os',
      title: 'Simulate Producer-Consumer Problem',
      subjectName: 'Operating System',
      date: 'Aug 04, 2026',
      hasCode: true,
      hasOutput: true,
    },
  ]);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuestions = recentQuestions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSubject = (subjectId) => {
    window.location.href = `/subject/${subjectId}`;
  };

  const handleAddQuestion = () => {
    window.location.href = '/questions/new';
  };

  const handleAddSubject = () => {
    const title = prompt('Enter subject name:');
    if (title && title.trim()) {
      setSubjects((prev) => [
        ...prev,
        { id: Date.now().toString(), name: title.trim(), count: 0 },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors">

      {/* Centered Main Layout */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 space-y-8">
        
        {/* Top Title Row */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
              Your Lab Notes
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Quickly access and organize your laboratory work.
            </p>
          </div>

          <button
            onClick={handleAddQuestion}
            className="inline-flex items-center space-x-1.5 bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-medium px-3.5 py-2 rounded-md shadow-xs hover:bg-indigo-700 dark:hover:bg-indigo-600 active:scale-98 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>

        {/* Subjects Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Subjects
            </h2>
            <button
              onClick={handleAddSubject}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              + Add Subject
            </button>
          </div>

          <SubjectList
            subjects={filteredSubjects}
            onSelectSubject={handleSelectSubject}
            onAddSubject={handleAddSubject}
          />
        </section>

        {/* Recent Lab Notes Section */}
        <section className="space-y-3 pt-2">
          <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Recent Lab Notes
          </h2>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 dark:text-gray-500">
                No lab notes found matching "{searchQuery}"
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => (window.location.href = `/question/${q.id}`)}
                  className="p-3 sm:px-4 sm:py-3 hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 cursor-pointer group"
                >
                  {/* Left Info */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {q.title}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center space-x-1.5">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{q.subjectName}</span>
                      <span>·</span>
                      <span>{q.date}</span>
                    </div>
                  </div>

                  {/* Right Status Indicators */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                        q.hasCode
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <Code2 className="w-3 h-3 mr-0.5" />
                      Code {q.hasCode && <Check className="w-2.5 h-2.5 ml-0.5" />}
                    </span>

                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                        q.hasOutput
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3 mr-0.5" />
                      Output {q.hasOutput && <Check className="w-2.5 h-2.5 ml-0.5" />}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}