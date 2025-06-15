import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

// T-shirt model component with error handling and loading state management
const TShirtModel = () => {
  const [modelError, setModelError] = useState(false);
  const modelRef = useRef();
  
  // Load the model with error handling
  const { scene, animations } = useGLTF("./tshirt121.glb", undefined, 
    (e) => {
      console.error("Error loading model:", e);
      setModelError(true);
    }
  );

  // Handle model animations if present
  useEffect(() => {
    if (animations && animations.length > 0 && scene && scene.children.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      
      animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
      });
      
      return () => mixer.stopAllAction();
    }
  }, [scene, animations]);

  // If there's an error loading the model, show fallback content
  if (modelError) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0fd6a0" />
      </mesh>
    );
  }

  // Return the 3D model with proper positioning and lighting
  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      scale={1.3} 
      position={[0, -2, 0]} 
      rotation={[0, Math.PI / 4, 0]}
    />
  );
};

// Loading spinner component for Suspense fallback
const ModelLoader = () => {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#0fd6a0" wireframe />
    </mesh>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center mt-7">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Left Section - Content */}
          <div className="md:w-1/2 space-y-6 mt-[-100px] text-center md:text-left z-10">
            <div className="relative">
              <h1 className="text-5xl md:text-6xl font-bold text-[#0fd6a0] leading-tight">
                Teex<span className="text-black">Verse</span>
              </h1>
              <div className="absolute -top-3 -right-3 bg-black h-12 w-12 rounded-full opacity-10 blur-md"></div>
            </div>
            
            <div className="inline-block bg-black rounded-lg px-4 py-2 transform -rotate-1">
              <p className="text-xs md:text-sm font-semibold text-white">
                Create your own style, wear what truly represents you
              </p>
            </div>
            
            <p className="text-gray-800 text-base md:text-lg max-w-lg font-light">
              TeexVerse isn't just a merch store — it's a design-driven brand. Our team creates exclusive, high-quality pieces that combine style, creativity, and originality. From sketch to print, we craft merch that tells your story.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={() => location.href='#products'} 
                className="bg-[#0fd6a0] hover:bg-[#0cc593] text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span>Explore Collection</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={() => navigate('/tmockup')} 
                className="bg-white border-2 border-[#0fd6a0] text-[#0fd6a0] font-bold py-3 px-6 rounded-lg transition duration-300 hover:bg-gray-50"
              >
                Customize Designs
              </button>
            </div>
          </div>

          {/* Right Section - 3D Model with proper Canvas implementation */}
          <div className="md:w-1/2 w-full h-[400px] md:h-[500px] mt-[-230px] relative">
            {/* Design elements for visual appeal */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0fd6a0] opacity-10 rounded-full h-64 w-64 md:h-80 md:w-80 blur-xl"></div>
            
            {/* Canvas with proper error boundaries */}
            <div className="w-[700PX] h-[600PX] rounded-xl overflow-hidden bg-gradient-to-b from-white to-gray-100">
              <Canvas 
                camera={{ position: [7, 0, 3], fov: 46 }}
                gl={{ antialias: true }}
                style={{ background: 'transparent' }}
                dpr={[1, 2]} // Responsive resolution
              >
                {/* Removed solid white color to match gradient background */}
                
                <ambientLight intensity={0.7} />
                <directionalLight 
                  position={[5, 5, 5]} 
                  intensity={1} 
                  castShadow 
                  shadow-mapSize-width={1024} 
                  shadow-mapSize-height={1024}
                />
                <spotLight position={[-5, 5, 5]} intensity={0.8} angle={0.3} penumbra={1} castShadow />
                
                <Suspense fallback={<ModelLoader />}>
                  <TShirtModel />
                  <ContactShadows 
                    rotation={[-Math.PI / 2, 0, 0]} 
                    position={[0, -1.5, 0]} 
                    opacity={0.5} 
                    width={10} 
                    height={10} 
                    blur={1.5} 
                    far={1.5} 
                  />
                  <Environment preset="city" />
                </Suspense>
                
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false}
                  autoRotate 
                  autoRotateSpeed={1}
                  minPolarAngle={Math.PI / 3} 
                  maxPolarAngle={Math.PI / 2}
                />
              </Canvas>
            </div>
            
            {/* Feature badges */}
            
          </div>
        </div>
      </div>
    </section>
  );
};

// Additional configuration for the container
const containerConfig = {
  container: {
    center: true,
    padding: {
      DEFAULT: "1rem",
      sm: "2rem",
      lg: "4rem",
      xl: "5rem",
      "2xl": "6rem",
    },
  },
};

export default Hero;