import React, { useState, useEffect } from "react";
import {
  ArrowLeft, Calendar, BookOpen, Code2, Copy, Check,
  Image as ImageIcon, Edit2, X, Upload, Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { useLoader } from "../context/LoaderContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function QuestionDetailsPage({ questionId, onBack }) {
  const [question, setQuestion] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [copied, setCopied] = useState(false);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    question: "",
    code: "",
    subjectId: "",
    experimentNo: "",
    labDate: "",
    ops: null
  });

  const { showLoader, hideLoader } = useLoader();

  // Fetch Question Details
  const fetchQuestionDetails = async () => {
    showLoader("Loading question details...");
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/api/question/${questionId}`);
      const data = res.data?.question || res.data;
      setQuestion(data);

      // Pre-fill Edit Form Data
      setEditFormData({
        question: data.question || "",
        code: data.code || "",
        subjectId: data.subjectId?._id || data.subjectId || "",
        experimentNo: data.experimentNo !== null && data.experimentNo !== undefined ? data.experimentNo : "",
        labDate: data.labDate ? new Date(data.labDate).toISOString().split("T")[0] : "",
        ops: null
      });
    } catch (err) {
      console.error("Error fetching question details:", err);
      toast.error(err.response?.data?.message || "Failed to load question details");
    } finally {
      hideLoader();
    }
  };

  // Fetch Subjects for Edit Dropdown
  const fetchSubjects = async () => {
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/api/subject`);
      setSubjects(res.data?.subjects || []);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  useEffect(() => {
    if (!questionId) return;
    fetchQuestionDetails();
    fetchSubjects();
  }, [questionId]);

  // Copy Code Handler
  const handleCopyCode = () => {
    if (!question?.code) return;
    navigator.clipboard.writeText(question.code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteQuestion = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this question?");
    if (!isConfirmed) return;

    showLoader("Deleting question...");
    try {
      const res = await axiosInstance.delete(`${API_BASE_URL}/api/question/${questionId}`);
      if (res.data?.success || res.status === 200) {
        toast.success(res.data?.message || "Question deleted successfully!");
        setQuestion(null);
        if (onBack) onBack();
      }
    } catch (err) {
      console.error("Error deleting question:", err);
      toast.error(err.response?.data?.message || "Failed to delete question");
    } finally {
      hideLoader();
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    showLoader("Updating question...");

    const formData = new FormData();
    formData.append("question", editFormData.question);
    formData.append("code", editFormData.code);
    formData.append("subjectId", editFormData.subjectId);
    
    if (editFormData.labDate) {
      formData.append("labDate", editFormData.labDate);
    } else {
      formData.append("labDate", "");
    }
    
    if (editFormData.ops) {
      formData.append("ops", editFormData.ops);
    }

    // Fix: Always append experimentNo (even if empty string so backend can catch it as null)
    formData.append("experimentNo", editFormData.experimentNo);

    try {
      const res = await axiosInstance.patch(
        `${API_BASE_URL}/api/question/${questionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.success || res.status === 200) {
        toast.success("Question updated successfully!");
        setIsEditOpen(false);
        await fetchQuestionDetails();
      }
    } catch (err) {
      console.error("Error updating question:", err);
      toast.error(err.response?.data?.message || "Failed to update question");
    } finally {
      hideLoader();
    }
  };

  if (!question) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Controls: Back, Edit & Delete Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Questions</span>
        </button>

        {/* Action Group */}
        <div className="flex items-center gap-2">
          {/* Delete Button */}
          <button
            onClick={handleDeleteQuestion}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium transition-all border border-red-200 dark:border-red-900/50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Question</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 sm:p-7 shadow-xs space-y-6">

        {/* Header Info */}
        <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Experiment No Badge (Glowing Indigo style) */}
            {question.experimentNo !== null && question.experimentNo !== undefined && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                Exp No: {question.experimentNo}
              </span>
            )}

            {/* Subject Badge (Standard style) */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              {question.subjectId?.name || "General"}
            </span>

            {/* Lab Date Badge (Standard style - same as Subject) */}
            {question.labDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(question.labDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {question.question}
          </h1>
        </div>

        {/* Main Content Grid: Image + Code */}
        <div className={`grid grid-cols-1 ${question.ops?.url && question.code ? "lg:grid-cols-2" : "grid-cols-1"} gap-6 items-start`}>

          {/* Left Side: Attached Screenshot / Ops Image */}
          {question.ops?.url && (
            <div className="space-y-2 w-full">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Attachment
              </h3>
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2">
                <img
                  src={question.ops?.url}
                  alt="Question preview"
                  className="w-full max-h-[500px] object-contain mx-auto rounded"
                />
              </div>
            </div>
          )}

          {/* Right Side: Code Snippet Section */}
          {question.code && (
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-slate-400" />
                  Solution / Code
                </h3>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Code"}</span>
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm p-4">
                <pre className="overflow-x-auto max-h-[500px] leading-relaxed">
                  <code>{question.code}</code>
                </pre>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* EDIT QUESTION MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Edit Question
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4">

              {/* Subject, Experiment No & Lab Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Subject Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <select
                    required
                    value={editFormData.subjectId}
                    onChange={(e) => setEditFormData({ ...editFormData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experiment No Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Experiment No
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 0, 1, 2..."
                    value={editFormData.experimentNo}
                    onChange={(e) => setEditFormData({ ...editFormData, experimentNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                {/* Lab Date Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lab Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.labDate}
                    onChange={(e) => setEditFormData({ ...editFormData, labDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Question *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editFormData.question}
                  onChange={(e) => setEditFormData({ ...editFormData, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Code Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Code / Solution
                </label>
                <textarea
                  rows={6}
                  value={editFormData.code}
                  onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {question?.ops?.url ? "Replace Output Image (Optional)" : "Add Output Image (Optional)"}
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer transition-colors border border-slate-200 dark:border-slate-700">
                    <Upload className="w-4 h-4" />
                    <span>{editFormData.ops ? editFormData.ops.name : "Choose New File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setEditFormData({ ...editFormData, ops: e.target.files[0] })}
                    />
                  </label>
                  {editFormData.ops && (
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, ops: null })}
                      className="text-xs text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}