import React, { useState, useRef, useEffect, useCallback } from "react";
import { Check, X, RotateCcw } from "lucide-react";

export default function CropOverlay({ element, onApply, onCancel }) {
  // crop normalized coordinates (0 to 1)
  const [crop, setCrop] = useState(
    element.crop || { x: 0, y: 0, width: 1, height: 1 }
  );

  const containerRef = useRef(null);
  const activeHandleRef = useRef(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, crop: { ...crop } });

  // Apply Inset Preset
  const applyInset = (amount) => {
    setCrop({
      x: amount,
      y: amount,
      width: Math.max(0.1, 1 - amount * 2),
      height: Math.max(0.1, 1 - amount * 2),
    });
  };

  // Dragging logic for corner & edge handles
  const handleMouseDown = (e, handle) => {
    e.stopPropagation();
    e.preventDefault();
    activeHandleRef.current = handle;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      crop: { ...crop },
    };
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!activeHandleRef.current) return;

      const handle = activeHandleRef.current;
      const dx = (e.clientX - dragStartRef.current.mouseX) / element.width;
      const dy = (e.clientY - dragStartRef.current.mouseY) / element.height;

      const initial = dragStartRef.current.crop;
      let newCrop = { ...initial };

      const minSize = 0.05; // minimum allowed crop area (5%)

      // Top / Bottom adjustment
      if (handle.includes("t")) {
        const possibleY = Math.min(Math.max(0, initial.y + dy), initial.y + initial.height - minSize);
        newCrop.height = initial.y + initial.height - possibleY;
        newCrop.y = possibleY;
      } else if (handle.includes("b")) {
        newCrop.height = Math.min(Math.max(minSize, initial.height + dy), 1 - initial.y);
      }

      // Left / Right adjustment
      if (handle.includes("l")) {
        const possibleX = Math.min(Math.max(0, initial.x + dx), initial.x + initial.width - minSize);
        newCrop.width = initial.x + initial.width - possibleX;
        newCrop.x = possibleX;
      } else if (handle.includes("r")) {
        newCrop.width = Math.min(Math.max(minSize, initial.width + dx), 1 - initial.x);
      }

      setCrop(newCrop);
    },
    [element.width, element.height]
  );

  const handleMouseUp = useCallback(() => {
    activeHandleRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Handle Positions for UI rendering
  const handles = [
    { id: "tl", className: "-top-1.5 -left-1.5 cursor-nwse-resize" },
    { id: "tm", className: "-top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize" },
    { id: "tr", className: "-top-1.5 -right-1.5 cursor-nesw-resize" },
    { id: "ml", className: "top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize" },
    { id: "mr", className: "top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize" },
    { id: "bl", className: "-bottom-1.5 -left-1.5 cursor-nesw-resize" },
    { id: "bm", className: "-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize" },
    { id: "br", className: "-bottom-1.5 -right-1.5 cursor-nwse-resize" },
  ];

  return (
    <div
      ref={containerRef}
      className="absolute border-2 border-blue-600 bg-blue-500/15 pointer-events-auto shadow-sm z-20"
      style={{
        left: `${element.x + crop.x * element.width}px`,
        top: `${element.y + crop.y * element.height}px`,
        width: `${crop.width * element.width}px`,
        height: `${crop.height * element.height}px`,
        transform: `rotate(${element.rotation}deg)`,
      }}
    >
      {/* 8 Drag Handles */}
      {handles.map((h) => (
        <div
          key={h.id}
          onMouseDown={(e) => handleMouseDown(e, h.id)}
          className={`absolute w-3 h-3 bg-white border-2 border-blue-600 rounded-full shadow-md z-30 ${h.className}`}
        />
      ))}

      {/* Floating Action Controls */}
      <div className="absolute -top-11 left-0 flex items-center space-x-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-1 rounded-md shadow-lg z-40 select-none">
        <button
          onClick={() => applyInset(0)}
          className="text-[11px] font-medium px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center gap-1"
          title="Reset Crop"
        >
          <RotateCcw className="w-3 h-3" />
          Full
        </button>
        <button
          onClick={() => applyInset(0.05)}
          className="text-[11px] font-medium px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          -5%
        </button>
        <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 my-auto" />
        <button
          onClick={() => onApply(crop)}
          className="p-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          title="Apply Crop"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onCancel}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300"
          title="Cancel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}