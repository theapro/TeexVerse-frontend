import React from "react";

// This component determines which region of the pattern the design is placed on
const PatternDetector = ({ onDetectRegion }) => {
  // Define regions based on normalized coordinates (-3.5 to 3.5)
 const regions = [
    {
      id: "front",
      x: [-3.47, -0.25], // front top-left to top-right
      y: [-2.07, 0.93],  // front bottom to top
    },
    {
      id: "back",
      x: [0.19, 3.35],   // back top-left to top-right
      y: [-2.11, 0.95],  // back bottom to top
    },
    {
      id: "leftShoulder",
      x: [-3.45, -0.1],  // full left zone
      y: [0.95, 3.49],   // from top of front up to top of canvas
    },
    {
      id: "rightShoulder",
      x: [0.1, 3.45],    // full right zone
      y: [0.95, 3.49],   // from top of back up to top of canvas
    },
  ];

  // Function to detect which region coordinates fall into
  const detectRegion = (x, y) => {
    // Check which region the coordinates fall into
    for (const region of regions) {
      if (
        x >= region.x[0] &&
        x <= region.x[1] &&
        y >= region.y[0] &&
        y <= region.y[1]
      ) {
        return region.id;
      }
    }
    return null;
  };

  // Expose the detectRegion function to the parent component
  React.useEffect(() => {
    if (onDetectRegion) {
      onDetectRegion(detectRegion);
    }

    return () => {
      if (onDetectRegion) {
        onDetectRegion(null);
      }
    };
  }, [onDetectRegion]);

  return null; // This component doesn't render anything visible
};

export default PatternDetector;