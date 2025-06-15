import { useRef, useEffect, useState, useCallback } from "react";
import { Stage, Layer, Image, Transformer } from "react-konva";

const KonvaDesignEditor = ({ imageObj, position, scale, rotation, onUpdate, onCanvasClick }) => {
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const transformerRef = useRef(null);

  const [imageSelected, setImageSelected] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });

  // Optimize update with requestAnimationFrame
  const updateRef = useRef();
  const throttledUpdate = useCallback((data) => {
    if (updateRef.current) {
      cancelAnimationFrame(updateRef.current);
    }
    updateRef.current = requestAnimationFrame(() => {
      onUpdate(data);
    });
  }, [onUpdate]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (updateRef.current) {
        cancelAnimationFrame(updateRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (imageObj) {
      const aspectRatio = imageObj.width / imageObj.height;
      const maxWidth = 200; // canvasga tushadigan default width
      const width = maxWidth;
      const height = maxWidth / aspectRatio;
      setDimensions({ width, height });
    }
  }, [imageObj]);

  useEffect(() => {
    if (imageSelected && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [imageSelected]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.scaleX(scale);
      imageRef.current.scaleY(scale);
      imageRef.current.rotation(rotation);
      transformerRef.current?.getLayer()?.batchDraw();
    }
  }, [scale, rotation]);

  const handleCanvasClick = (e) => {
    if (e.target === e.target.getStage()) {
      setImageSelected(false);
      const pointerPosition = e.target.getPointerPosition();
      if (pointerPosition && onCanvasClick) {
        onCanvasClick({
          x: pointerPosition.x,
          y: pointerPosition.y
        });
      }
    }
  };

  const handleDragMove = (e) => {
    throttledUpdate({
      position: {
        x: e.target.x(),
        y: e.target.y()
      },
      scale: e.target.scaleX(),
      rotation: e.target.rotation()
    });
  };

  const handleTransform = () => {
    const node = imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const newScale = Math.max(scaleX, scaleY);

    throttledUpdate({
      position: {
        x: node.x(),
        y: node.y()
      },
      scale: newScale,
      rotation: node.rotation()
    });
  };

  const handleTransformEnd = () => {
    const node = imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const newScale = Math.max(scaleX, scaleY);

    node.scaleX(newScale);
    node.scaleY(newScale);
  };

  if (!imageObj) {
    return (
      <Stage width={350} height={350} ref={stageRef} onClick={handleCanvasClick}>
        <Layer />
      </Stage>
    );
  }

  return (
    <Stage width={350} height={350} ref={stageRef} onClick={handleCanvasClick}>
      <Layer>
        <Image
          ref={imageRef}
          image={imageObj}
          x={position.x}
          y={position.y}
          width={dimensions.width}
          height={dimensions.height}
          offsetX={dimensions.width / 2}
          offsetY={dimensions.height / 2}
          draggable
          onClick={() => setImageSelected(true)}
          onTap={() => setImageSelected(true)}
          onDragMove={handleDragMove}
          onTransform={handleTransform}
          onTransformEnd={handleTransformEnd}
          onMouseEnter={(e) => {
            const container = e.target.getStage().container();
            container.style.cursor = "pointer";
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage().container();
            container.style.cursor = "default";
          }}
        />
        {imageSelected && (
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 20 || newBox.height < 20) {
                return oldBox;
              }
              return newBox;
            }}
            rotateEnabled={true}
            keepRatio={true}
            enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default KonvaDesignEditor;
