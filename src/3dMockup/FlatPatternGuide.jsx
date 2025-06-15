import React from "react";

const FlatPatternGuide = ({ patternTexture }) => {
  return (
    <mesh position={[0, 0, 0]}>
      {/* Use a plane geometry to display the t-shirt pattern layout */}
      <planeGeometry args={[7, 7]} /> 
      <meshBasicMaterial 
        map={patternTexture}
        transparent 
        opacity={0.8}
      />
    </mesh>
  );
};

export default FlatPatternGuide;