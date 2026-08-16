import React, { useRef, useEffect } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

export default function ImageElement({
  element,
  isSelected,
  onSelect,
  onChange,
  isCropping,
}) {
  const [image] = useImage(element.src, "anonymous");
  const shapeRef = useRef(null);
  const trRef = useRef(null);

  // Attach Transformer when element is selected
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current && !isCropping) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, isCropping]);

  // Compute source cropping dimensions
  const cropX = element.crop.x * (image?.width || 0);
  const cropY = element.crop.y * (image?.height || 0);
  const cropWidth = element.crop.width * (image?.width || 0);
  const cropHeight = element.crop.height * (image?.height || 0);

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
        crop={
          image
            ? {
                x: cropX,
                y: cropY,
                width: cropWidth,
                height: cropHeight,
              }
            : undefined
        }
        draggable={isSelected && !isCropping}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: Math.round(e.target.x()),
            y: Math.round(e.target.y()),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale to 1 and explicitly apply changes to width & height
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            x: Math.round(node.x()),
            y: Math.round(node.y()),
            width: Math.max(10, Math.round(node.width() * scaleX)),
            height: Math.max(10, Math.round(node.height() * scaleY)),
            rotation: Math.round(node.rotation()),
          });
        }}
      />

      {/* Selection Transformer Handles */}
      {isSelected && !isCropping && (
        <Transformer
          ref={trRef}
          keepRatio={true}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            // Set minimum bounding size
            if (newBox.width < 15 || newBox.height < 15) {
              return oldBox;
            }
            return newBox;
          }}
          anchorSize={8}
          anchorCornerRadius={2}
          borderStroke="#2563eb"
          borderStrokeWidth={1.5}
          anchorFill="#ffffff"
          anchorStroke="#2563eb"
        />
      )}
    </>
  );
}