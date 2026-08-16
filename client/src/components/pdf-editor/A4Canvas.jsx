import React, { forwardRef } from "react";
import { Stage, Layer } from "react-konva";
import ImageElement from "./ImageElement";

const A4Canvas = forwardRef(({
  documentState,
  selectedId,
  setSelectedId,
  onElementChange,
  isCropping,
}, ref) => {
  const handleStageMouseDown = (e) => {
    // Clicked on empty canvas background -> deselect
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty && !isCropping) {
      setSelectedId(null);
    }
  };

  return (
    <Stage
      ref={ref}
      width={documentState.width}
      height={documentState.height}
      onMouseDown={handleStageMouseDown}
      onTouchStart={handleStageMouseDown}
      className="bg-white"
    >
      <Layer>
        {documentState.elements.map((el) => (
          <ImageElement
            key={el.id}
            element={el}
            isSelected={el.id === selectedId}
            onSelect={() => !isCropping && setSelectedId(el.id)}
            onChange={(newAttrs) => onElementChange(el.id, newAttrs)}
            isCropping={isCropping}
          />
        ))}
      </Layer>
    </Stage>
  );
});

export default A4Canvas;