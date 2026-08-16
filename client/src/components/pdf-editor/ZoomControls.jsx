import React, { useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

export default function ZoomControls({ zoom, setZoom }) {
  const presets = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(2, Math.round((z + 0.1) * 100) / 100));
  }, [setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(0.4, Math.round((z - 0.1) * 100) / 100));
  }, [setZoom]);

  // Ctrl + Mouse Wheel Scroll Zoom Event Listener
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleZoomIn, handleZoomOut]);

  return (
    <footer className="h-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 z-10 shrink-0 shadow-xs">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-slate-800 dark:text-slate-200">A4 Document</span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="text-slate-400 dark:text-slate-500">794 × 1123 px</span>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleZoomOut}
          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          title="Zoom Out (Ctrl + Scroll Down)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <select
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="bg-transparent border border-slate-200 dark:border-slate-700/80 rounded-md px-2 py-0.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          {presets.map((p) => (
            <option key={p} value={p} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
              {Math.round(p * 100)}%
            </option>
          ))}
        </select>

        <button
          onClick={handleZoomIn}
          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          title="Zoom In (Ctrl + Scroll Up)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}