import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

const ModelViewer = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
      <ambientLight intensity={1} />
      <Environment preset="sunset" />
      <OrbitControls />
      <primitive object={scene} />
    </Canvas>
  );
};
