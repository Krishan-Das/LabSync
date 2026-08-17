import React, { useState, useRef, useEffect, useCallback, useContext } from "react";
import { BookOpen, FolderCheck, Plus, RotateCcw, Crop, Trash2, Undo, Redo, Image as ImageIcon, Download, X, Home, Sun, Moon } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";

import EditorToolbar from "../components/pdf-editor/EditorToolbar";
import A4Canvas from "../components/pdf-editor/A4Canvas";
import PropertiesPanel from "../components/pdf-editor/PropertiesPanel";
import ZoomControls from "../components/pdf-editor/ZoomControls";
import CropOverlay from "../components/pdf-editor/CropOverlay";
import SavedQuestionsModal from "../components/pdf-editor/SavedQuestionsModal";

import { useLoader } from "../context/LoaderContext";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const getScaledDimensions = (imgWidth, imgHeight, crop = { width: 1, height: 1 }, targetWidth = 320) => {
  const croppedPixelWidth = imgWidth * crop.width;
  const croppedPixelHeight = imgHeight * crop.height;

  const scale = targetWidth / croppedPixelWidth;
  return {
    width: targetWidth,
    height: Math.round(croppedPixelHeight * scale),
  };
};

const HeaderPlaceholder = ({ toggleTheme, theme }) => (
  <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between z-10 shadow-xs">
    {/* Left Section: Logo & Title */}
    <div className="flex items-center space-x-2.5">
      <Link to="/" className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
          <img src="/labSync.svg" alt="LabSync Logo" />
        </div>
        <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-sm sm:text-base">
          LabSync
        </span>
      </Link>
      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold border border-blue-100 dark:border-blue-900/50">
        Output Editor
      </span>
    </div>

    {/* Right Section: Theme Toggle & Home */}
    <div className="flex items-center space-x-3">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
        aria-label="Toggle Theme"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700" />
        )}
      </button>

      <Link
        to="/"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Go to Home</span>
      </Link>
    </div>
  </header>
);

export default function PdfEditor() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { showLoader, hideLoader } = useLoader();

  const [documentState, setDocumentState] = useState({
    pageSize: "A4",
    orientation: "portrait",
    width: 794,
    height: 1123,
    elements: [],
  });

  const [selectedId, setSelectedId] = useState(null);
  const [copiedElement, setCopiedElement] = useState(null);
  const [zoom, setZoom] = useState(0.5);
  const [isCropping, setIsCropping] = useState(false);

  // Saved Questions Modal State
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // PDF Preview State
  const [previewDataUrl, setPreviewDataUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [history, setHistory] = useState([documentState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const fileInputRef = useRef(null);
  const stageRef = useRef(null); // Konva Stage Reference

  const updateDocumentState = useCallback((newState) => {
    setDocumentState(newState);
    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      return [...updated, newState];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setDocumentState(history[nextIndex]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setDocumentState(history[nextIndex]);
    }
  }, [historyIndex, history]);

  const selectedElement = documentState.elements.find((el) => el.id === selectedId);

  // Independent Column-based Layout Engine
  const calculatePerfectGrid = useCallback((elements) => {
    const paddingX = 48;
    const paddingY = 48;
    const gapX = 34;
    const gapY = 28;

    const cols = 2;
    const targetWidth = 320;

    const columnHeights = new Array(cols).fill(paddingY);

    return elements.map((el, index) => {
      const col = index % cols;

      const origW = el.originalWidth || el.width;
      const origH = el.originalHeight || el.height;
      const crop = el.crop || { x: 0, y: 0, width: 1, height: 1 };

      const { width, height } = getScaledDimensions(origW, origH, crop, targetWidth);

      const x = Math.round(paddingX + col * (targetWidth + gapX));
      const y = columnHeights[col];

      columnHeights[col] += height + gapY;

      return {
        ...el,
        x,
        y: Math.round(y),
        width,
        height,
        rotation: 0,
      };
    });
  }, []);

  const processAndLayoutFiles = (files, docWidth, docHeight, existingElements) => {
    const targetWidth = 320;

    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const src = typeof file === "string" ? file : URL.createObjectURL(file);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;

        img.onload = () => {
          const { width, height } = getScaledDimensions(
            img.width,
            img.height,
            { x: 0, y: 0, width: 1, height: 1 },
            targetWidth
          );

          resolve({
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: "image",
            src,
            originalSrc: src,
            originalWidth: img.width,
            originalHeight: img.height,
            x: 0,
            y: 0,
            width,
            height,
            rotation: 0,
            crop: { x: 0, y: 0, width: 1, height: 1 },
          });
        };
      });
    });

    return Promise.all(imagePromises).then((loadedElements) => {
      const combined = [...existingElements, ...loadedElements];
      return calculatePerfectGrid(combined);
    });
  };

  const handleAddScreenshotClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    showLoader?.("Uploading & processing images...");
    try {
      const allPositionedElements = await processAndLayoutFiles(
        files,
        documentState.width,
        documentState.height,
        documentState.elements
      );

      const updated = {
        ...documentState,
        elements: allPositionedElements,
      };

      updateDocumentState(updated);

      if (allPositionedElements.length > 0) {
        setSelectedId(allPositionedElements[allPositionedElements.length - 1].id);
      }
      toast.success("Images added successfully!");
    } catch (err) {
      toast.error("Failed to load images");
    } finally {
      hideLoader?.();
      e.target.value = "";
    }
  };

  const handleImportFromSaved = async (urls) => {
    if (!urls || urls.length === 0) return;

    showLoader?.("Importing saved screenshots...");
    try {
      const allPositionedElements = await processAndLayoutFiles(
        urls,
        documentState.width,
        documentState.height,
        documentState.elements
      );

      const updated = {
        ...documentState,
        elements: allPositionedElements,
      };

      updateDocumentState(updated);

      if (allPositionedElements.length > 0) {
        setSelectedId(allPositionedElements[allPositionedElements.length - 1].id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to import saved screenshots");
    } finally {
      hideLoader?.();
    }
  };

  const handleApplyTemplate = () => {
    if (!documentState.elements.length) return;
    const rearrangedElements = calculatePerfectGrid(documentState.elements);
    updateDocumentState({ ...documentState, elements: rearrangedElements });
    toast.success("Layout organized!");
  };

  const handleElementChange = (id, newAttrs) => {
    const nextElements = documentState.elements.map((el) =>
      el.id === id ? { ...el, ...newAttrs } : el
    );
    updateDocumentState({ ...documentState, elements: nextElements });
  };

  const handleDeleteSelected = useCallback(() => {
    if (!selectedId) return;
    const nextElements = documentState.elements.filter((el) => el.id !== selectedId);
    setSelectedId(null);
    setIsCropping(false);

    const rearranged = calculatePerfectGrid(nextElements);
    updateDocumentState({ ...documentState, elements: rearranged });
    toast.success("Element deleted!");
  }, [selectedId, documentState, updateDocumentState, calculatePerfectGrid]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !isCropping) {
        e.preventDefault();
        handleDeleteSelected();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, isCropping, handleDeleteSelected]);

  const handleApplyCrop = (cropRect) => {
    if (!selectedId || !selectedElement) return;

    const origW = selectedElement.originalWidth || selectedElement.width;
    const origH = selectedElement.originalHeight || selectedElement.height;

    const updatedElements = documentState.elements.map((el) => {
      if (el.id === selectedId) {
        const { width, height } = getScaledDimensions(origW, origH, cropRect, 320);
        return {
          ...el,
          crop: cropRect,
          width,
          height,
        };
      }
      return el;
    });

    const recalculatedElements = calculatePerfectGrid(updatedElements);
    updateDocumentState({ ...documentState, elements: recalculatedElements });
    setIsCropping(false);
    toast.success("Crop applied!");
  };

  const handleResetSelected = () => {
    if (!selectedElement) return;

    const origW = selectedElement.originalWidth || selectedElement.width;
    const origH = selectedElement.originalHeight || selectedElement.height;
    const fullCrop = { x: 0, y: 0, width: 1, height: 1 };

    const updatedElements = documentState.elements.map((el) => {
      if (el.id === selectedId) {
        const { width, height } = getScaledDimensions(origW, origH, fullCrop, 320);
        return {
          ...el,
          crop: fullCrop,
          width,
          height,
          rotation: 0,
        };
      }
      return el;
    });

    const recalculatedElements = calculatePerfectGrid(updatedElements);
    updateDocumentState({ ...documentState, elements: recalculatedElements });
    setIsCropping(false);
    toast.success("Image reset to full view");
  };

  const handleCopy = useCallback(() => {
    if (!selectedId) return;
    const elementToCopy = documentState.elements.find((el) => el.id === selectedId);
    if (elementToCopy) {
      setCopiedElement(elementToCopy);
      toast.success("Copied to clipboard!");
    }
  }, [selectedId, documentState.elements]);

  const handlePaste = useCallback(() => {
    if (!copiedElement) return;

    const newElement = {
      ...copiedElement,
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      x: copiedElement.x + 20,
      y: copiedElement.y + 20,
    };

    const updatedElements = [...documentState.elements, newElement];
    const recalculated = calculatePerfectGrid(updatedElements);

    updateDocumentState({ ...documentState, elements: recalculated });
    setSelectedId(newElement.id);
    toast.success("Pasted element!");
  }, [copiedElement, documentState, updateDocumentState, calculatePerfectGrid]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCopy();
      }
      if (isCtrlOrCmd && e.key.toLowerCase() === "v") {
        e.preventDefault();
        handlePaste();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCopy, handlePaste]);

  const getCanvasImageDataUrl = () => {
    if (!stageRef.current) return null;
    setSelectedId(null); // Selection outline হাইড করা
    setIsCropping(false);

    return stageRef.current.toDataURL({ pixelRatio: 2 });
  };

  const handleOpenPdfPreview = () => {
    const dataUrl = getCanvasImageDataUrl();
    if (dataUrl) {
      setPreviewDataUrl(dataUrl);
      setIsPreviewOpen(true);
    }
  };

  const handleConfirmSavePdf = () => {
    if (!previewDataUrl) return;
    showLoader?.("Generating A4 PDF...");

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(previewDataUrl, "PNG", 0, 0, 210, 297);
      pdf.save(`LabSync_Document_${Date.now()}.pdf`);

      toast.success("PDF Downloaded!");
      setIsPreviewOpen(false);
    } catch (err) {
      toast.error("Failed to generate PDF");
    } finally {
      hideLoader?.();
    }
  };

  const handlePrint = () => {
    const dataUrl = getCanvasImageDataUrl();
    if (!dataUrl) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Document - LabSync</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #fff;
            }
            img {
              width: 100vw;
              height: 100vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple
        className="hidden"
      />

      {/* Header */}
      <HeaderPlaceholder toggleTheme={toggleTheme} theme={theme} />

      {/* Workspace */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Editor Toolbar matching HomePage UI */}
        <EditorToolbar
          onAddScreenshot={handleAddScreenshotClick}
          onAddFromSaved={() => setIsSavedModalOpen(true)}
          onApplyTemplate={handleApplyTemplate}
          onCrop={() => setIsCropping(!isCropping)}
          onReset={handleResetSelected}
          onDelete={handleDeleteSelected}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSavePdf={handleOpenPdfPreview}
          onPrint={handlePrint}
          hasSelection={Boolean(selectedId)}
          hasElements={documentState.elements.length > 0}
          isCropping={isCropping}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />

        {/* Canvas Area with Responsive Zoom & Scroll Handling */}
        <main
          className="flex-1 overflow-auto p-8 bg-slate-100 dark:bg-slate-950/80"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedId(null);
              setIsCropping(false);
            }
          }}
        >
          <div
            className="flex items-center justify-center min-h-full min-w-full m-auto"
            style={{
              width: `${documentState.width * zoom + 64}px`,
              height: `${documentState.height * zoom + 64}px`,
            }}
          >
            <div
              className="transition-transform duration-150 ease-out origin-top-center"
              style={{
                transform: `scale(${zoom})`,
                width: `${documentState.width}px`,
                height: `${documentState.height}px`,
              }}
            >
              <div className="relative shadow-xl rounded-lg bg-white border border-slate-200 dark:border-slate-800 overflow-hidden">
                <A4Canvas
                  ref={stageRef}
                  documentState={documentState}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  onElementChange={handleElementChange}
                  isCropping={isCropping}
                />

                {isCropping && selectedElement && (
                  <CropOverlay
                    element={selectedElement}
                    onApply={handleApplyCrop}
                    onCancel={() => setIsCropping(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Properties Sidebar Panel */}
        <PropertiesPanel
          selectedElement={selectedElement}
          onChange={(newAttrs) => selectedId && handleElementChange(selectedId, newAttrs)}
        />
      </div>

      {/* Floating Zoom Bar */}
      <ZoomControls zoom={zoom} setZoom={setZoom} />

      {/* Saved Questions Modal */}
      <SavedQuestionsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onImport={handleImportFromSaved}
      />

      {/* PDF Download Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base">
                PDF Export Preview
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto bg-slate-100 dark:bg-slate-950/50 flex justify-center flex-1">
              {previewDataUrl && (
                <img
                  src={previewDataUrl}
                  alt="A4 Canvas Preview"
                  className="shadow-md rounded border border-slate-200 dark:border-slate-800 max-h-[60vh] object-contain bg-white"
                />
              )}
            </div>

            <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3 bg-white dark:bg-slate-900">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSavePdf}
                className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center space-x-2 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Confirm Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}