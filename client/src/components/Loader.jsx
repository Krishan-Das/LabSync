import React from "react";
import { Loader2 } from "lucide-react";

export default function Loader({ size = "md", text = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-blue-600 dark:text-blue-400`} />
      {text && <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{text}</span>}
    </div>
  );
}