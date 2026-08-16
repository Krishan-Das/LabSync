import React from "react";
import { SlidersHorizontal } from "lucide-react";

export default function PropertiesPanel({ selectedElement, onChange }) {
  if (!selectedElement) {
    return (
      <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-col p-4 z-10 shrink-0 shadow-xs">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
          <SlidersHorizontal className="w-4 h-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">Properties</h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-slate-400 dark:text-slate-500 px-4">
          <p>Select an element on the canvas to adjust its properties.</p>
        </div>
      </aside>
    );
  }

  const handleNumChange = (field, value) => {
    const parsed = parseInt(value, 10);
    onChange({ [field]: isNaN(parsed) ? 0 : parsed });
  };

  return (
    <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-col p-4 space-y-4 z-10 shrink-0 shadow-xs">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
        <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider">Properties</h3>
      </div>

      {/* Position Fields */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-0.5">X (px)</span>
            <input
              type="number"
              value={selectedElement.x}
              onChange={(e) => handleNumChange("x", e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-0.5">Y (px)</span>
            <input
              type="number"
              value={selectedElement.y}
              onChange={(e) => handleNumChange("y", e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Size Fields */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Dimensions</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-0.5">Width</span>
            <input
              type="number"
              value={selectedElement.width}
              onChange={(e) => handleNumChange("width", e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-0.5">Height</span>
            <input
              type="number"
              value={selectedElement.height}
              onChange={(e) => handleNumChange("height", e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Rotation Field */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Rotation</label>
        <div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-0.5">Angle (deg)</span>
          <input
            type="number"
            value={selectedElement.rotation}
            onChange={(e) => handleNumChange("rotation", e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    </aside>
  );
}