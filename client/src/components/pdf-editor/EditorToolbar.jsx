import React from "react";
import {
  ImagePlus,
  FolderCheck,
  LayoutGrid,
  Crop,
  RotateCcw,
  Trash2,
  Undo2,
  Redo2,
  Download,
  Printer,
} from "lucide-react";

export default function EditorToolbar({
  onAddScreenshot,
  onAddFromSaved,
  onApplyTemplate,
  onCrop,
  onReset,
  onDelete,
  onUndo,
  onRedo,
  onSavePdf,
  onPrint,
  hasSelection,
  hasElements,
  isCropping,
  canUndo,
  canRedo,
}) {
  return (
    <aside className="w-16 md:w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-3 z-10 shrink-0 select-none shadow-sm">
      {/* Top Section: Main Actions & Tools */}
      <div className="space-y-4">
        {/* Section 1: Primary Action & Templates */}
        <div className="space-y-2">
          <button
            onClick={onAddScreenshot}
            className="w-full flex items-center justify-center md:justify-start space-x-2.5 h-10 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
            title="Add Screenshot"
          >
            <ImagePlus className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline truncate">+ Add Screenshot</span>
          </button>

          <button
            onClick={onAddFromSaved}
            className="w-full flex items-center justify-center md:justify-start space-x-2.5 h-9 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm transition-colors cursor-pointer border border-blue-200/60 dark:border-blue-800/40"
            title="Add from Saved Programs"
          >
            <FolderCheck className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline truncate">Import Saved</span>
          </button>

          <button
            onClick={onApplyTemplate}
            disabled={!hasElements}
            className="w-full flex items-center justify-center md:justify-start space-x-2.5 h-9 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="Arrange in 2x3 Grid Layout"
          >
            <LayoutGrid className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
            <span className="hidden md:inline truncate">2x3 Grid Layout</span>
          </button>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-800" />

        {/* Section 2: Edit Tools (Contextual) */}
        <div className="space-y-1">
          <p className="hidden md:block px-1 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-1">
            Editing
          </p>

          <button
            onClick={onCrop}
            disabled={!hasSelection}
            className={`w-full flex items-center justify-center md:justify-start space-x-2.5 h-9 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed ${
              isCropping
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold"
                : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:hover:bg-transparent"
            }`}
            title="Crop Selected Image"
          >
            <Crop className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline truncate">Crop</span>
          </button>

          <button
            onClick={onReset}
            disabled={!hasSelection}
            className="w-full flex items-center justify-center md:justify-start space-x-2.5 h-9 px-3 rounded-lg text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
            title="Reset Position & Crop"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline truncate">Reset View</span>
          </button>

          <button
            onClick={onDelete}
            disabled={!hasSelection}
            className="w-full flex items-center justify-center md:justify-start space-x-2.5 h-9 px-3 rounded-lg text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
            title="Delete Selected Image"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline truncate">Delete</span>
          </button>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-800" />

        {/* Section 3: History Controls */}
        <div>
          <p className="hidden md:block px-1 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-1.5">
            History
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="flex items-center justify-center h-9 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="flex items-center justify-center h-9 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Document Export & Print */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          onClick={onSavePdf}
          disabled={!hasElements}
          className="w-full flex items-center justify-center md:justify-start space-x-2.5 h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          title="Download as A4 PDF"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span className="hidden md:inline truncate">Save PDF</span>
        </button>

        <button
          onClick={onPrint}
          disabled={!hasElements}
          className="w-full flex items-center justify-center md:justify-start space-x-2.5 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          title="Print A4 Document"
        >
          <Printer className="w-4 h-4 shrink-0" />
          <span className="hidden md:inline truncate">Print</span>
        </button>
      </div>
    </aside>
  );
}