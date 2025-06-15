import { useEffect, useState, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { TextureLoader, MeshStandardMaterial, RepeatWrapping } from "three";

const TShirtModel = ({ color, design }) => {
  const { scene } = useGLTF("/tshirt121.glb");
  const [texture, setTexture] = useState(null);
  const materialsRef = useRef({});

  useEffect(() => {
    if (!design || !design.image) return;

    const loader = new TextureLoader();

    loader.load(
      design.image,
      (newTexture) => {
        newTexture.wrapS = RepeatWrapping;
        newTexture.wrapT = RepeatWrapping;

        if (design.position) {
          // Center the texture by default and adjust based on pattern editor coordinates
          const x = design.position.x;
          const y = design.position.y;

          newTexture.offset.set(0.5 + x / 4, 0.5 + y / 4);
        }

        if (design.scale) {
          // Apply scale inversely (smaller scale value = larger appearance)
          const scaleValue = 1 / Math.max(0.1, design.scale);
          newTexture.repeat.set(scaleValue, scaleValue);
        }

        // Apply rotation if provided
        if (design.rotation) {
          newTexture.rotation = design.rotation * Math.PI / 180;
          newTexture.center.set(0.5, 0.5); // Rotate around center
        }

        newTexture.flipY = false;
        newTexture.needsUpdate = true;
        setTexture(newTexture);
        
       
      },
      undefined,
      (error) => {
        console.error("Error loading texture:", error);
      }
    );
  }, [design]);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((node) => {
      if (node.isMesh) {
        if (!materialsRef.current[node.name]) {
          materialsRef.current[node.name] = new MeshStandardMaterial({
            color: color,
            map: null,
            roughness: 0.7,
            metalness: 0.1,
          });
        }

        // Update color for all mesh parts
        materialsRef.current[node.name].color.set(color);
        materialsRef.current[node.name].needsUpdate = true;

        // Apply design texture if available
        if (texture && design && design.region) {
          // Map regions to specific mesh parts - using the naming convention from your model
          const regionMapping = {
            front: ["Tshirt_A-Pose_2"],
            back: ["Tshirt_A-Pose_1"],
            leftShoulder: ["Tshirt_A-Pose_3"],
            rightShoulder: ["Tshirt_A-Pose_4"]
          };

          // Apply texture to the appropriate mesh parts
          if (
            regionMapping[design.region] && 
            regionMapping[design.region].includes(node.name)
          ) {
           
            materialsRef.current[node.name].map = texture;
          } else {
            materialsRef.current[node.name].map = null;
          }
        } else if (texture && !design.region) {
          // If no specific region, apply to front by default
          if (node.name === "Tshirt_A-Pose_2") {
            materialsRef.current[node.name].map = texture;
          } else {
            materialsRef.current[node.name].map = null;
          }
        } else {
          materialsRef.current[node.name].map = null;
        }

        materialsRef.current[node.name].needsUpdate = true;
        node.material = materialsRef.current[node.name];
      }
    });
  }, [scene, color, texture, design]);

  if (!scene) {
    return null;
  }

  return (
    <primitive
      object={scene}
      scale={[1, 1, 1]}
      position={[0, -1.5, 0]}
      rotation={[0, 0, 0]}
    />
  );
};

export default TShirtModel;