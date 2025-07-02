import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { TextureLoader } from "three";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";

import TShirtModel from "./TshirtModel";
import FlatPatternGuide from "./FlatPatternGuide";
import PatternDetector from "../3dMockup/PatternDetector";
import KonvaDesignEditor from "./KonvaDesignEditor";

export default function TShirtMockupApp() {
  // Bug fix: To properly track panel state and ensure both render
  const [prevShowPanels, setPrevShowPanels] = useState(true);
  const [color, setColor] = useState("#ffffff");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [design, setDesign] = useState(null);
  const [background, setBackground] = useState("gray");
  const [patternTexture, setPatternTexture] = useState(null);
  const [uploadedImageObj, setUploadedImageObj] = useState(null);
  const [designPosition, setDesignPosition] = useState({ x: 175, y: 175 });
  const [designScale, setDesignScale] = useState(1);
  const [designRotation, setDesignRotation] = useState(0);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [detectRegion, setDetectRegion] = useState(null);
  const [clickCoordinates, setClickCoordinates] = useState(null);
  // Add state for panels visibility
  const [showPanels, setShowPanels] = useState(true);

  const controls = useRef();
  const fileInputRef = useRef(null);
  const stageRef = useRef(null);

  // Effect to handle keyboard shortcut (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle panels visibility when spacebar is pressed
      if (e.key === " " || e.code === "Space") {
        e.preventDefault(); // Prevent page scroll on spacebar
        // Track previous state to ensure proper re-rendering
        setPrevShowPanels(showPanels);
        setShowPanels((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPanels]);

  const togglePanels = () => {
    // Track previous state to ensure proper re-rendering
    setPrevShowPanels(showPanels);
    setShowPanels((prev) => !prev);
  };

  const zoomIn = () => {
    if (controls.current) {
      controls.current.object.position.z -= 0.5;
      controls.current.object.position.z = Math.max(
        controls.current.object.position.z,
        4
      );
    }
  };

  const zoomOut = () => {
    if (controls.current) {
      controls.current.object.position.z += 0.5;
      controls.current.object.position.z = Math.min(
        controls.current.object.position.z,
        15
      );
    }
  };

  useEffect(() => {
    const loader = new TextureLoader();
    setLoading(true);

    // Try to load the pattern texture from public folder
    loader.load(
      "../../public/image.png",
      (tex) => {
        tex.needsUpdate = true;
        setPatternTexture(tex);
        setLoading(false);
        setCanvasReady(true);
       
      },
      undefined,
      (err) => {
        console.error("Error loading pattern texture:", err);

        // Create a fallback texture with canvas if the image fails to load
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");

        // Draw background
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, 1024, 1024);

        // Draw vertical line
        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(512, 0);
        ctx.lineTo(512, 1024);
        ctx.stroke();

        // Draw horizontal line
        ctx.beginPath();
        ctx.moveTo(0, 512);
        ctx.lineTo(1024, 512);
        ctx.stroke();

        // Add labels matching regions in PatternDetector
        ctx.font = "48px Arial";
        ctx.fillStyle = "#999999";
        ctx.textAlign = "center";

        ctx.fillText("FRONT", 256, 256);
        ctx.fillText("BACK", 768, 256);
        ctx.fillText("LEFT", 256, 768);
        ctx.fillText("RIGHT", 768, 768);

        const placeholderTexture = new TextureLoader().load(canvas.toDataURL());
        setPatternTexture(placeholderTexture);
        setLoading(false);
        setCanvasReady(true);
      }
    );
  }, []);

  useEffect(() => {
    if (!uploadedImage) return;

    // Create image object for Konva
    const imageObj = new window.Image();
    imageObj.src = uploadedImage;
    imageObj.onload = () => {
      setUploadedImageObj(imageObj);
      
      // Update design with normalized coordinates for 3D model
      const normalizedX = (designPosition.x - 175) / 175 * 3.5;
      const normalizedY = (175 - designPosition.y) / 175 * 3.5;
      
      // Get current region
      let regionId = null;
      if (detectRegion) {
        regionId = detectRegion(normalizedX, normalizedY);
      }
      
      setCurrentRegion(regionId);
      
      setDesign({
        image: uploadedImage,
        position: { x: normalizedX, y: normalizedY },
        scale: designScale,
        rotation: designRotation,
        region: regionId // Important: Pass the region to the 3D model
      });
      
      setLoading(false);
    };
  }, [uploadedImage, detectRegion]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      setUploadedImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (coords) => {
    // Convert Konva coordinates (0-350) to normalized coordinates (-3.5 to 3.5)
    const normalizedX = (coords.x - 175) / 175 * 3.5;
    const normalizedY = (175 - coords.y) / 175 * 3.5;
    
    // Store both raw and normalized coordinates
    setClickCoordinates({
      raw: coords,
      normalized: { x: normalizedX, y: normalizedY }
    });
    
    // Get region at click position
    if (detectRegion) {
      const regionId = detectRegion(normalizedX, normalizedY);
      console.log(`Clicked region: ${regionId || 'none'} at coordinates:`, coords, `(normalized: ${normalizedX.toFixed(2)}, ${normalizedY.toFixed(2)})`);
      
      // If there's a design and we clicked on a valid region, move the design there
      if (uploadedImageObj && regionId) {
        setDesignPosition(coords);
        setCurrentRegion(regionId);
        
        setDesign({
          image: uploadedImage,
          position: { x: normalizedX, y: normalizedY },
          scale: designScale,
          rotation: designRotation,
          region: regionId
        });
      }
    }
  };

  const handleDesignUpdate = ({ position, scale, rotation }) => {
    // Convert Konva coordinates (0-350) to normalized coordinates for 3D model (-3.5 to 3.5)
    const normalizedX = (position.x - 175) / 175 * 3.5;
    const normalizedY = (175 - position.y) / 175 * 3.5;
    
    let regionId = null;
    if (detectRegion) {
      regionId = detectRegion(normalizedX, normalizedY);
    }
    
    setCurrentRegion(regionId);
    setDesignPosition(position);
    setDesignScale(scale);
    setDesignRotation(rotation);
    
    setDesign({
      image: uploadedImage,
      position: { x: normalizedX, y: normalizedY },
      scale: scale,
      rotation: rotation,
      region: regionId
    });
  };

  const backgroundStyles = {
    gray: "bg-gradient-to-br from-gray-700 to-gray-900",
    black: "bg-gradient-to-br from-black to-gray-900",
    transparent: "bg-white",
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-white relative" key={`panels-${showPanels}`}>
      {/* Toggle Panels Button - Always visible */}
      <button
        className="absolute top-4 right-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all flex items-center justify-center"
        onClick={togglePanels}
        title={`${showPanels ? "Hide" : "Show"} Panels (Spacebar)`}
      >
        {showPanels ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Left Panel - Conditionally rendered based on showPanels state */}
      {showPanels && (
        <div className="w-64 flex-shrink-0 bg-white border-r p-6 flex flex-col overflow-y-auto">
          <div className="mb-6 flex items-center">
            <h1 className="text-xl font-bold">T-Shirt Mockup</h1>
          </div>

          <button
            className="bg-black text-white w-full py-2.5 px-4 rounded-md mb-6 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            <span>{loading ? "Loading..." : "Upload Design"}</span>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
          </button>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Zoom Controls
            </label>
            <div className="flex gap-2">
              <button
                className="bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-black transition-colors"
                onClick={zoomIn}
              >
                Zoom In
              </button>
              <button
                className="bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-black transition-colors"
                onClick={zoomOut}
              >
                Zoom Out
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Garment Color
            </label>
            <input
              type="color"
              className="w-10 h-10 rounded-full border-2 border-gray-200 cursor-pointer"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Background</label>
            <select
              className="w-full border border-gray-300 p-2.5 rounded-md"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            >
              <option value="gray">Gray</option>
              <option value="black">Black</option>
              <option value="transparent">Transparent</option>
            </select>
          </div>

          {currentRegion && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Current Region
              </label>
              <div className="text-blue-600 font-medium">
                {currentRegion.charAt(0).toUpperCase() + currentRegion.slice(1)}
              </div>
            </div>
          )}

          {clickCoordinates && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Last Click Coordinates
              </label>
              <div className="text-sm">
                <p>Raw: ({clickCoordinates.raw.x.toFixed(0)}, {clickCoordinates.raw.y.toFixed(0)})</p>
                <p>Normalized: ({clickCoordinates.normalized.x.toFixed(2)}, {clickCoordinates.normalized.y.toFixed(2)})</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Center Panel - Always shown but expanded when panels are hidden */}
      <div className={`${showPanels ? 'flex-grow' : 'w-full'} ${backgroundStyles[background]} transition-all duration-300`}>
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
          <Suspense fallback={<Html>Loading T-Shirt...</Html>}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <TShirtModel color={color} design={design} />
            <Environment preset="city" />
            <OrbitControls
              ref={controls}
              enablePan={false}
              enableZoom={true}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
              minDistance={4}
              maxDistance={15}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Right Panel - Conditionally rendered based on showPanels state */}
      {showPanels && (
        <div className="w-[400px] flex-shrink-0 bg-white border-l p-6 flex flex-col overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Pattern Editor</h2>

          <button
            className="bg-gray-900 text-white w-full py-2.5 px-4 rounded-md mb-4 flex items-center justify-center gap-2 hover:bg-black transition-colors"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            <span>{loading ? "Loading..." : "Upload Design"}</span>
          </button>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Design Scale</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="5"
              value={designScale}
              onChange={(e) => {
                const newScale = Math.min(Math.max(parseFloat(e.target.value) || 0.1, 0.1), 5);
                setDesignScale(newScale);
                if (design) {
                  handleDesignUpdate({
                    position: designPosition,
                    scale: newScale,
                    rotation: designRotation
                  });
                }
              }}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          {/* Pattern Canvas with Konva */}
          <div className="w-[350px] h-[350px] border border-gray-300 rounded-md overflow-hidden bg-gray-100">
            {canvasReady && (
              <div className="relative w-full h-full">
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 10] }}>
                    <FlatPatternGuide patternTexture={patternTexture} />
                    <PatternDetector onDetectRegion={setDetectRegion} />
                  </Canvas>
                </div>
                
                {/* Konva layer for interactive design */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <KonvaDesignEditor 
                    imageObj={uploadedImageObj}
                    position={designPosition}
                    scale={designScale}
                    rotation={designRotation}
                    onUpdate={handleDesignUpdate}
                    onCanvasClick={handleCanvasClick}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-600">
            {currentRegion ? (
              <p>
                Design placed on:{" "}
                {currentRegion.charAt(0).toUpperCase() + currentRegion.slice(1)}
              </p>
            ) : (
              <p>Click on a region or drag design to place it</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}