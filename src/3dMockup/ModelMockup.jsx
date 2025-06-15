import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { TextureLoader, Vector2, MeshStandardMaterial } from "three";

function TShirtModel({ color, designs }) {
  const { scene } = useGLTF("./tshirt121.glb");
  const [textures, setTextures] = useState({});

 
  useEffect(() => {
    const loader = new TextureLoader();
    const newTextures = {};
    let texturesLoaded = false;

    Object.keys(designs).forEach((part) => {
      const data = designs[part];
      if (data && data.image) {
        loader.load(
          data.image,
          (tex) => {
            if (data.position) {
              tex.offset = new Vector2(data.position.x, data.position.y);
            }
            if (data.scale) {
              tex.repeat = new Vector2(data.scale, data.scale);
            }
            tex.wrapS = tex.wrapT = 1000; // THREE.ClampToEdgeWrapping
            tex.needsUpdate = true;
            newTextures[part] = tex;
            
            // Check if all textures are loaded
            const allPartsProcessed = Object.keys(designs).every(key => 
              !designs[key] || !designs[key].image || newTextures[key]
            );
            
            if (allPartsProcessed && !texturesLoaded) {
              texturesLoaded = true;
              setTextures(newTextures);
            
            }
          },
          undefined,
          (err) => console.error(`Error loading texture for ${part}:`, err)
        );
      }
    });
  }, [designs]);

useEffect(() => {
    if (!scene) return;

    scene.traverse((node) => {
      if (node.isMesh && node.material) {
       

        // Create new material for the mesh
        node.material = new MeshStandardMaterial({
          color: color,
          map: null,
        });

        // Apply textures based on mesh name
        if (node.name === "Tshirt_A-Pose_2" && textures.front) {
          node.material.map = textures.front;
         
        } else if (node.name === "Tshirt_A-Pose_1" && textures.back) {
          node.material.map = textures.back;
          
        }

        node.material.needsUpdate = true;
      }
    });
  }, [scene, color, textures]);

  if (!scene) {
    return null;
  }

  return <primitive object={scene} scale={[1, 1, 1]} position={[0, -1.5, 0]} />;
}

// Flat Pattern Guide component
const FlatPatternGuide = ({ patternTextures }) => {
  const regions = [
    { id: "front", position: [-1, 1], size: [2, 2] },
    { id: "back", position: [1, 1], size: [2, 2] },
    { id: "leftShoulder", position: [-1, -1], size: [2, 2] },
    { id: "rightShoulder", position: [1, -1], size: [2, 2] },
  ];

  return regions.map((region) => (
    <mesh key={region.id} position={[region.position[0], region.position[1], 0]}>
      <planeGeometry args={region.size} />
      <meshBasicMaterial 
        map={patternTextures[region.id] || null} 
        transparent 
        opacity={patternTextures[region.id] ? 1 : 0.3}
        color={patternTextures[region.id] ? "#ffffff" : "#cccccc"}
      />
    </mesh>
  ));
};

// Draggable Image component with resizable bounding box
const DesignDraggableImage = ({ texture, position, setPosition, scale, setScale, onUpdateDesign }) => {
  const meshRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setDragging(true);
  };

  const handlePointerUp = () => {
    setDragging(false);
    setResizing(false);
    setResizeHandle(null);
  };

  const handlePointerMove = (e) => {
    if (dragging && !resizing) {
      const point = e.point;
      setPosition({ x: point.x, y: point.y });
      onUpdateDesign({ position: { x: point.x, y: point.y }, scale });
    } else if (resizing && resizeHandle) {
      const point = e.point;
      // Calculate new scale based on distance from center
      const dx = Math.abs(point.x - position.x);
      const dy = Math.abs(point.y - position.y);
      const newScale = Math.max(dx, dy) * 2; // Scale based on max dimension
      const clampedScale = Math.min(Math.max(newScale, 0.1), 5); // Clamp scale
      setScale(clampedScale);
      onUpdateDesign({ position, scale: clampedScale });
    }
  };

  const handleResizeStart = (e, handle) => {
    e.stopPropagation();
    setResizing(true);
    setResizeHandle(handle);
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setDragging(false);
      setResizing(false);
      setResizeHandle(null);
    };
    
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, []);

  if (!texture) return null;

  // Define corner handles for resizing
  const handleSize = 0.2;
  const handles = [
    { id: 'top-left', position: [-scale / 2, scale / 2, 0.02] },
    { id: 'top-right', position: [scale / 2, scale / 2, 0.02] },
    { id: 'bottom-left', position: [-scale / 2, -scale / 2, 0.02] },
    { id: 'bottom-right', position: [scale / 2, -scale / 2, 0.02] },
  ];

  return (
    <group position={[position.x, position.y, 0.01]}>
      {/* Image mesh */}
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        scale={[scale, scale, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
      {/* Bounding box outline */}
      <mesh>
        <planeGeometry args={[scale, scale]} />
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.5} />
      </mesh>
      {/* Resize handles */}
      {handles.map((handle) => (
        <mesh
          key={handle.id}
          position={handle.position}
          onPointerDown={(e) => handleResizeStart(e, handle.id)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <planeGeometry args={[handleSize, handleSize]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
      ))}
    </group>
  );
};

// Region hover and selection detector
const HoverDetector = ({ onHoverRegion, onSelectPart, selectedPart }) => {
  const regions = [
    { id: "front", position: [-1, 1], size: [2, 2] },
    { id: "back", position: [1, 1], size: [2, 2] },
    { id: "leftShoulder", position: [-1, -1], size: [2, 2] },
    { id: "rightShoulder", position: [1, -1], size: [2, 2] },
  ];

  return regions.map((region) => (
    <mesh
      key={region.id}
      position={[region.position[0], region.position[1], 0.02]}
      onPointerOver={() => onHoverRegion(region.id)}
      onPointerOut={() => onHoverRegion(null)}
      onClick={() => onSelectPart(region.id)}
    >
      <planeGeometry args={region.size} />
      <meshBasicMaterial 
        transparent 
        opacity={0.1} 
        color={selectedPart === region.id ? "#3b82f6" : "#000000"} 
      />
    </mesh>
  ));
};

// Main component
export default function TShirtMockupApp() {
  const [color, setColor] = useState("#ffffff");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [designs, setDesigns] = useState({
    front: null,
    back: null,
    leftShoulder: null,
    rightShoulder: null,
  });
  const [selectedPart, setSelectedPart] = useState("front");
  const [background, setBackground] = useState("gray");
  const [patternTextures, setPatternTextures] = useState({});
  const [uploadedImageTexture, setUploadedImageTexture] = useState(null);
  const [designPosition, setDesignPosition] = useState({ x: 0, y: 0 });
  const [designScale, setDesignScale] = useState(1);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const controls = useRef();

  const fileInputRef = useRef(null);

  // Zoom functions
  const zoomIn = () => {
    if (controls.current) {
      controls.current.object.position.z -= 0.5;
      controls.current.object.position.z = Math.max(controls.current.object.position.z, 4);
    }
  };

  const zoomOut = () => {
    if (controls.current) {
      controls.current.object.position.z += 0.5;
      controls.current.object.position.z = Math.min(controls.current.object.position.z, 15);
    }
  };

  // Load pattern textures
  useEffect(() => {
    const loader = new TextureLoader();
    setLoading(true);

    const patternPaths = {
      front: "/pattern_front.png",
      back: "/pattern_back.png",
      leftShoulder: "/pattern_left.png", 
      rightShoulder: "/pattern_right.png",
    };

    const texturePromises = Object.keys(patternPaths).map(part => {
      return new Promise((resolve) => {
        loader.load(
          patternPaths[part],
          (tex) => {
            tex.needsUpdate = true;
            setPatternTextures(prev => ({ ...prev, [part]: tex }));
            resolve();
          },
          undefined,
          () => {
            console.warn(`Error loading pattern for ${part}, using fallback`);
            loader.load(
              "https://via.placeholder.com/512?text=" + part,
              (tex) => {
                tex.needsUpdate = true;
                setPatternTextures(prev => ({ ...prev, [part]: tex }));
                resolve();
              },
              undefined,
              () => resolve()
            );
          }
        );
      });
    });

    Promise.all(texturePromises).then(() => {
      setLoading(false);
    });
  }, []);

  // Load uploaded image as texture
  useEffect(() => {
    if (!uploadedImage) return;

    const loader = new TextureLoader();
    setLoading(true);
    
    loader.load(
      uploadedImage,
      (texture) => {
        setUploadedImageTexture(texture);
        setLoading(false);
       
      },
      undefined,
      (err) => {
        console.error("Error loading uploaded image:", err);
        setLoading(false);
      }
    );
  }, [uploadedImage]);

  // Handle image upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      setUploadedImage(imageData);

      if (selectedPart) {
        setDesigns(prev => ({
          ...prev,
          [selectedPart]: {
            image: imageData,
            position: designPosition,
            scale: designScale,
          }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Update design scale via input
  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
    if (isNaN(newScale)) return;
    
    setDesignScale(newScale);
    
    if (selectedPart && designs[selectedPart]) {
      setDesigns(prev => ({
        ...prev,
        [selectedPart]: {
          ...prev[selectedPart],
          scale: newScale,
        }
      }));
    }
  };

  // Update design position and scale
  const handleDesignUpdate = ({ position, scale }) => {
    if (selectedPart && designs[selectedPart]) {
      setDesigns(prev => ({
        ...prev,
        [selectedPart]: {
          ...prev[selectedPart],
          position,
          scale,
        }
      }));
    }
  };

  // Handle part selection
  const handleSelectPart = (part) => {
    setSelectedPart(part);
   
    
    if (designs[part]) {
      if (designs[part].position) {
        setDesignPosition(designs[part].position);
      }
      if (designs[part].scale) {
        setDesignScale(designs[part].scale);
      }
    } else {
      setDesignPosition({ x: 0, y: 0 });
      setDesignScale(1);
    }
  };

  const backgroundStyles = {
    gray: "bg-gradient-to-br from-gray-700 to-gray-900",
    black: "bg-gradient-to-br from-black to-gray-900",
    transparent: "bg-white",
  };

  return (
    <div className="flex h-screen font-sans bg-white">
      {/* Left Panel */}
      <div className="w-64 bg-white border-r p-6 flex flex-col">
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
          <label className="block text-sm font-medium mb-2">Zoom Controls</label>
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
          <label className="block text-sm font-medium mb-2">Garment Color</label>
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

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Selected Part</label>
          <div className="text-blue-600 font-medium">
            {selectedPart ? selectedPart.charAt(0).toUpperCase() + selectedPart.slice(1) : "None"}
          </div>
        </div>
      </div>

      {/* Center Panel */}
      <div className={`flex-1 ${backgroundStyles[background]}`}>
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
          <Suspense fallback={<Html>Loading T-Shirt...</Html>}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <TShirtModel color={color} designs={designs} />
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

      {/* Right Panel */}
      <div className="w-64 bg-white border-l p-6 flex flex-col">
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
            onChange={handleScaleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div className="w-full h-64 border border-gray-300 rounded-md overflow-hidden">
          <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 10] }}>
            <ambientLight intensity={1} />
            <FlatPatternGuide patternTextures={patternTextures} />
            {uploadedImageTexture && (
              <DesignDraggableImage
                texture={uploadedImageTexture}
                position={designPosition}
                setPosition={setDesignPosition}
                scale={designScale}
                setScale={setDesignScale}
                onUpdateDesign={handleDesignUpdate}
              />
            )}
            <HoverDetector
              onHoverRegion={setHoveredRegion}
              onSelectPart={handleSelectPart}
              selectedPart={selectedPart}
            />
          </Canvas>
        </div>
        
        <div className="mt-4 text-xs text-gray-600">
          {hoveredRegion ? (
            <p>Hover: {hoveredRegion.charAt(0).toUpperCase() + hoveredRegion.slice(1)}</p>
          ) : (
            <p>Click on a region to select it</p>
          )}
        </div>
      </div>
    </div>
  );
}