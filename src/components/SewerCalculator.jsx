import React, { useState, useEffect } from "react";
import {
  Download,
  Printer,
  Plus,
  Trash2,
  Settings,
  X,
  Save,
  Info,
} from "lucide-react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import _ from "lodash";

const SewerCalculator = () => {
  // State for storing pipe segments data with enhanced fields
  const [segments, setSegments] = useState([
    {
      id: 1,
      startMH: "MH1",
      endMH: "MH2",
      length: 50,
      startElevation: 100.0,
      endElevation: 99.75,
      area: 2.5,
      flowRate: 0,
    },
  ]);

  // State for constants (with defaults)
  const [constants, setConstants] = useState({
    rainfallIntensity: 90, // L/s/ha
    runoffCoefficient: 0.8,
    manningCoefficient: 0.013, // Manning's roughness coefficient
    minVelocity: 0.7, // m/s
    maxVelocity: 2.5, // m/s
    minSlope: 0.005, // min slope
    minDiameter: 200, // mm
    minDepthRatio: 0.3, // H/D ratio
    maxDepthRatio: 0.8, // H/D ratio
  });

  // State for settings modal
  const [showSettings, setShowSettings] = useState(false);
  // State for info modal
  const [showInfo, setShowInfo] = useState(false);

  // Standard pipe diameters in mm
  const standardDiameters = [
    160, 200, 250, 315, 400, 500, 600, 800, 1000, 1200,
  ];

  // Calculate results for each segment
  const calculateResults = (segments, constants) => {
    return segments.map((segment) => {
      // Calculate elevation difference and slope
      const elevationDiff = segment.startElevation - segment.endElevation;
      const slope = segment.length > 0 ? elevationDiff / segment.length : 0;

      // Calculate flow rate (Q) - either use user input or calculate from area
      const flowRate =
        segment.flowRate > 0
          ? segment.flowRate
          : constants.runoffCoefficient *
            constants.rainfallIntensity *
            segment.area;

      // Determine suitable pipe diameter and flow depth ratio using Manning's equation
      // We'll check various diameters and find the best one that meets velocity and depth criteria
      let selectedDiameter = constants.minDiameter;
      let selectedDepthRatio = constants.minDepthRatio;
      let velocity = 0;

      // Only proceed with calculations if we have valid inputs
      if (flowRate > 0 && segment.length > 0 && slope > 0) {
        // Try different standard diameters until we find one that works
        for (const diameter of standardDiameters) {
          // Calculate cross-sectional area for different depth ratios
          for (
            let depthRatio = constants.minDepthRatio;
            depthRatio <= constants.maxDepthRatio;
            depthRatio += 0.05
          ) {
            // Convert diameter to meters
            const diameterM = diameter / 1000;

            // Calculate flow area based on depth ratio
            // This is an approximation for partially filled circular pipes
            const theta = 2 * Math.acos(1 - 2 * depthRatio);
            const flowArea =
              ((diameterM * diameterM) / 8) * (theta - Math.sin(theta));

            // Calculate wetted perimeter
            const wettedPerimeter = (diameterM * theta) / 2;

            // Calculate hydraulic radius
            const hydraulicRadius = flowArea / wettedPerimeter;

            // Manning's equation for velocity (m/s)
            velocity =
              (1.0 / constants.manningCoefficient) *
              Math.pow(hydraulicRadius, 2 / 3) *
              Math.pow(slope, 1 / 2);

            // Calculate flow capacity
            const calculatedFlow = velocity * flowArea * 1000; // L/s

            // Check if this diameter and depth ratio can handle the flow and meet velocity criteria
            if (
              calculatedFlow >= flowRate &&
              velocity >= constants.minVelocity &&
              velocity <= constants.maxVelocity
            ) {
              selectedDiameter = diameter;
              selectedDepthRatio = depthRatio;
              break;
            }
          }

          // If we found a solution, stop checking larger diameters
          if (selectedDiameter === diameter) {
            break;
          }
        }
      }

      return {
        ...segment,
        flowRate,
        slope: slope.toFixed(4),
        diameter: selectedDiameter,
        depthRatio: selectedDepthRatio.toFixed(2),
        velocity: velocity.toFixed(2),
      };
    });
  };

  // Computed results
  const results = calculateResults(segments, constants);

  // Add a new segment
  const addSegment = () => {
    if (segments.length >= 200) {
      alert("Maximum limit of 200 segments reached.");
      return;
    }

    const lastSegment = segments[segments.length - 1];
    const newSegment = {
      id: lastSegment ? lastSegment.id + 1 : 1,
      startMH: lastSegment ? lastSegment.endMH : "MH1",
      endMH: lastSegment ? `MH${lastSegment.id + 2}` : "MH2",
      length: 0,
      startElevation: lastSegment ? lastSegment.endElevation : 100.0,
      endElevation: lastSegment ? lastSegment.endElevation - 0.25 : 99.75,
      area: 0,
      flowRate: 0,
    };

    setSegments([...segments, newSegment]);
  };

  // Remove a segment
  const removeSegment = (id) => {
    if (segments.length <= 1) {
      alert("At least one segment is required.");
      return;
    }
    setSegments(segments.filter((segment) => segment.id !== id));
  };

  // Update segment value
  const updateSegment = (id, field, value) => {
    let processedValue = value;

    if (field !== "startMH" && field !== "endMH") {
      processedValue = parseFloat(value) || 0;
    }

    setSegments(
      segments.map((segment) =>
        segment.id === id ? { ...segment, [field]: processedValue } : segment
      )
    );
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      results.map((r, index) => ({
        Segment: index + 1,
        "Start MH": r.startMH,
        "End MH": r.endMH,
        "Length (m)": parseFloat(r.length).toFixed(2),
        "Start Elevation (m)": parseFloat(r.startElevation).toFixed(2),
        "End Elevation (m)": parseFloat(r.endElevation).toFixed(2),
        "Area (ha)": parseFloat(r.area).toFixed(2),
        "Flow Rate (L/s)": parseFloat(r.flowRate).toFixed(2),
        Slope: r.slope,
        "Suggested Diameter (mm)": r.diameter,
        "Depth Ratio (H/D)": r.depthRatio,
        "Velocity (m/s)": r.velocity,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sewer Calculations");

    XLSX.writeFile(workbook, "sewer_calculations.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Sewer Network Hydraulic Calculations", 14, 15);

    // Add parameters
    doc.setFontSize(10);
    doc.text(
      `Rainfall Intensity: ${constants.rainfallIntensity} L/s/ha | Runoff Coefficient: ${constants.runoffCoefficient} | Min Slope: ${constants.minSlope}`,
      14,
      25
    );

    // Add table
    const tableColumn = [
      "Segment",
      "Start MH",
      "End MH",
      "Length (m)",
      "Flow (L/s)",
      "Slope",
      "Dia (mm)",
      "H/D",
      "V (m/s)",
    ];
    const tableRows = results.map((r, index) => [
      index + 1,
      r.startMH,
      r.endMH,
      parseFloat(r.length).toFixed(2),
      parseFloat(r.flowRate).toFixed(2),
      r.slope,
      r.diameter,
      r.depthRatio,
      r.velocity,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 1,
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
        8: { cellWidth: 15 },
      },
    });

    doc.save("sewer_calculations.pdf");
  };

  // Print results
  const printResults = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 print:shadow-none">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Sewer Network Hydraulic Calculator
          </h1>
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 text-blue-600 hover:text-blue-800 rounded"
          >
            <Info size={20} />
          </button>
        </div>

        {/* Top info bar with parameters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-blue-50 p-4 rounded-md">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 md:mb-0">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Rainfall Intensity:</span>{" "}
              {constants.rainfallIntensity} L/s/ha
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Runoff Coefficient:</span>{" "}
              {constants.runoffCoefficient}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Manning's n:</span>{" "}
              {constants.manningCoefficient}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Min Slope:</span>{" "}
              {constants.minSlope}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Min Depth Ratio:</span>{" "}
              {constants.minDepthRatio}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Max Depth Ratio:</span>{" "}
              {constants.maxDepthRatio}
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              <Settings size={16} className="mr-1" />
              <span>Settings</span>
            </button>

            <button
              onClick={exportToExcel}
              className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
            >
              <Download size={16} className="mr-1" />
              <span>Excel</span>
            </button>

            <button
              onClick={exportToPDF}
              className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              <Download size={16} className="mr-1" />
              <span>PDF</span>
            </button>

            <button
              onClick={printResults}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm print:hidden"
            >
              <Printer size={16} className="mr-1" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Calculation Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rainfall Intensity (L/s/ha)
                  </label>
                  <input
                    type="number"
                    value={constants.rainfallIntensity}
                    onChange={(e) =>
                      setConstants({
                        ...constants,
                        rainfallIntensity: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Runoff Coefficient
                  </label>
                  <input
                    type="number"
                    value={constants.runoffCoefficient}
                    onChange={(e) =>
                      setConstants({
                        ...constants,
                        runoffCoefficient: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manning's Coefficient
                  </label>
                  <input
                    type="number"
                    value={constants.manningCoefficient}
                    onChange={(e) =>
                      setConstants({
                        ...constants,
                        manningCoefficient: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded"
                    min="0.01"
                    max="0.02"
                    step="0.001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Slope
                  </label>
                  <input
                    type="number"
                    value={constants.minSlope}
                    onChange={(e) =>
                      setConstants({
                        ...constants,
                        minSlope: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded"
                    min="0.0001"
                    step="0.0001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Velocity (m/s)
                  </label>
                  <input
                    type="number"
                    value={constants.minVelocity}
                    onChange={(e) =>
                      setConstants({
                        ...constants,
                        minVelocity: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded"
                    min="0.3"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Velocity (m/s)
                  </label>
                  <input
                    type="number"
                    value={constants.maxVelocity}
                    onChange={(e) =>
                      setConstants({
                        ...constants,
                        maxVelocity: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded"
                    min="1"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Diameter (mm)
                  </label>
                  <select
                    value={constants.minDiameter}
                    onChange={(e) =>
                      setConstants({
                        ...constants,
                        minDiameter: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded"
                  >
                    {standardDiameters.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Depth Ratio (H/D)
                  </label>
                  <input
                    type="number"
                    value={constants.minDepthRatio}
                    onChange={(e) =>
                      setConstants({
                        ...constants,
                        minDepthRatio: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded"
                    min="0.1"
                    max="0.9"
                    step="0.05"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Depth Ratio (H/D)
                  </label>
                  <input
                    type="number"
                    value={constants.maxDepthRatio}
                    onChange={(e) =>
                      setConstants({
                        ...constants,
                        maxDepthRatio: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border rounded"
                    min="0.1"
                    max="0.9"
                    step="0.05"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  <Save size={16} className="mr-1" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  About Sewer Network Hydraulic Calculator
                </h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="prose max-w-none">
                <p>
                  This calculator helps in designing gravity-based
                  wastewater/sewer networks using Manning's equation.
                </p>

                <h4>Input Parameters:</h4>
                <ul className="list-disc pl-5">
                  <li>
                    <strong>Start MH:</strong> Identifier for the starting
                    manhole
                  </li>
                  <li>
                    <strong>End MH:</strong> Identifier for the ending manhole
                  </li>
                  <li>
                    <strong>Length (m):</strong> Distance between manholes
                  </li>
                  <li>
                    <strong>Start Elevation (m):</strong> Ground level at
                    starting manhole
                  </li>
                  <li>
                    <strong>End Elevation (m):</strong> Ground level at ending
                    manhole
                  </li>
                  <li>
                    <strong>Area (ha):</strong> Catchment area contributing to
                    the pipe segment
                  </li>
                  <li>
                    <strong>Flow Rate (L/s):</strong> Direct flow input (if
                    known) - otherwise calculated from area
                  </li>
                </ul>

                <h4>Output Parameters:</h4>
                <ul className="list-disc pl-5">
                  <li>
                    <strong>Slope:</strong> Calculated from elevation difference
                    and length
                  </li>
                  <li>
                    <strong>Diameter (mm):</strong> Recommended pipe diameter
                  </li>
                  <li>
                    <strong>Depth Ratio (H/D):</strong> Ratio of flow depth to
                    pipe diameter
                  </li>
                  <li>
                    <strong>Velocity (m/s):</strong> Flow velocity in the pipe
                  </li>
                </ul>

                <h4>Calculation Method:</h4>
                <p>
                  The calculator uses the Rational Method for flow estimation
                  and Manning's equation for hydraulic calculations of partially
                  filled pipes.
                </p>

                <p className="mt-4">The basic formulas used are:</p>
                <ul className="list-disc pl-5">
                  <li>
                    Flow (Q) = Runoff Coefficient × Rainfall Intensity × Area
                  </li>
                  <li>Manning's equation: V = (1/n) × R^(2/3) × S^(1/2)</li>
                  <li>
                    Where: V = velocity, n = Manning's coefficient, R =
                    hydraulic radius, S = slope
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowInfo(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Table */}
        <h2 className="text-lg font-semibold mb-4">Pipe Segment Input Data</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 border-b w-16 text-left">Segment</th>
                <th className="py-2 px-3 border-b text-left">Start MH</th>
                <th className="py-2 px-3 border-b text-left">End MH</th>
                <th className="py-2 px-3 border-b text-left">Length (m)</th>
                <th className="py-2 px-3 border-b text-left">
                  Start Elev. (m)
                </th>
                <th className="py-2 px-3 border-b text-left">End Elev. (m)</th>
                <th className="py-2 px-3 border-b text-left">Area (ha)</th>
                <th className="py-2 px-3 border-b text-left">
                  Flow Rate (L/s)
                </th>
                <th className="py-2 px-3 border-b w-16"></th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment, index) => (
                <tr
                  key={segment.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-3 border-b">{index + 1}</td>
                  <td className="py-2 px-3 border-b">
                    <input
                      type="text"
                      value={segment.startMH}
                      onChange={(e) =>
                        updateSegment(segment.id, "startMH", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="py-2 px-3 border-b">
                    <input
                      type="text"
                      value={segment.endMH}
                      onChange={(e) =>
                        updateSegment(segment.id, "endMH", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="py-2 px-3 border-b">
                    <input
                      type="number"
                      value={segment.length || ""}
                      onChange={(e) =>
                        updateSegment(segment.id, "length", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="py-2 px-3 border-b">
                    <input
                      type="number"
                      value={segment.startElevation || ""}
                      onChange={(e) =>
                        updateSegment(
                          segment.id,
                          "startElevation",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      step="0.01"
                    />
                  </td>
                  <td className="py-2 px-3 border-b">
                    <input
                      type="number"
                      value={segment.endElevation || ""}
                      onChange={(e) =>
                        updateSegment(
                          segment.id,
                          "endElevation",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      step="0.01"
                    />
                  </td>
                  <td className="py-2 px-3 border-b">
                    <input
                      type="number"
                      value={segment.area || ""}
                      onChange={(e) =>
                        updateSegment(segment.id, "area", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="py-2 px-3 border-b">
                    <input
                      type="number"
                      value={segment.flowRate || ""}
                      onChange={(e) =>
                        updateSegment(segment.id, "flowRate", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      min="0"
                      step="0.01"
                      placeholder="Optional"
                    />
                  </td>
                  <td className="py-2 px-3 border-b">
                    <button
                      onClick={() => removeSegment(segment.id)}
                      className="p-1 text-red-600 hover:text-red-800 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={addSegment}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            <Plus size={16} className="mr-1" />
            <span>Add Segment</span>
          </button>
        </div>

        {/* Results Table */}
        <h2 className="text-lg font-semibold mb-4">
          Hydraulic Calculation Results
        </h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 border-b text-left">Segment</th>
                <th className="py-2 px-3 border-b text-left">Start MH</th>
                <th className="py-2 px-3 border-b text-left">End MH</th>
                <th className="py-2 px-3 border-b text-left">Length (m)</th>
                <th className="py-2 px-3 border-b text-left">
                  Flow Rate (L/s)
                </th>
                <th className="py-2 px-3 border-b text-left">Slope (i)</th>
                <th className="py-2 px-3 border-b text-left">Diameter (mm)</th>
                <th className="py-2 px-3 border-b text-left">
                  Depth Ratio (H/D)
                </th>
                <th className="py-2 px-3 border-b text-left">Velocity (m/s)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => {
                const isValidResult =
                  parseFloat(result.slope) > 0 &&
                  parseFloat(result.flowRate) > 0;
                const rowClass = isValidResult
                  ? index % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                  : "bg-red-100";

                return (
                  <tr key={result.id} className={rowClass}>
                    <td className="py-2 px-3 border-b">{index + 1}</td>
                    <td className="py-2 px-3 border-b">{result.startMH}</td>
                    <td className="py-2 px-3 border-b">{result.startMH}</td>
                    <td className="py-2 px-3 border-b">{result.endMH}</td>
                    <td className="py-2 px-3 border-b">
                      {parseFloat(result.length).toFixed(2)}
                    </td>
                    <td className="py-2 px-3 border-b">
                      {parseFloat(result.flowRate).toFixed(2)}
                    </td>
                    <td
                      className="py-2 px-3 border-b"
                      style={{
                        color:
                          parseFloat(result.slope) < constants.minSlope
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {result.slope}{" "}
                      {parseFloat(result.slope) < constants.minSlope && "(!)"}
                    </td>
                    <td className="py-2 px-3 border-b">{result.diameter}</td>
                    <td className="py-2 px-3 border-b">{result.depthRatio}</td>
                    <td
                      className="py-2 px-3 border-b"
                      style={{
                        color:
                          parseFloat(result.velocity) < constants.minVelocity ||
                          parseFloat(result.velocity) > constants.maxVelocity
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {result.velocity}{" "}
                      {(parseFloat(result.velocity) < constants.minVelocity ||
                        parseFloat(result.velocity) > constants.maxVelocity) &&
                        "(!)"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer with warnings and notes */}
        <div className="text-sm text-gray-600 mt-6 border-t pt-4">
          <p className="mb-2">
            <strong>Note:</strong> Red highlighted rows indicate potential
            issues with calculations.
          </p>
          <p className="mb-2">
            <strong>Warning indicators:</strong>
          </p>
          <ul className="list-disc pl-5">
            <li>Slope (!) - Slope is less than minimum recommended value</li>
            <li>Velocity (!) - Velocity is outside the recommended range</li>
          </ul>
          <p className="mt-4">
            Use this calculator for preliminary design only. Final designs
            should be verified by a qualified engineer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SewerCalculator;

// import { useState, useEffect } from 'react';

// export default function WastewaterPipelineCalculator() {
//   // Available pipe diameters in mm
//   const pipeDiameters = [200, 250, 300, 400, 500, 600];
  
//   // Standard settings with default values
//   const [settings, setSettings] = useState({
//     rainfallIntensity: 90,      // Интенсивность осадков: L/s/ha
//     runoffCoefficient: 0.8,     // Коэффициент стока
//     manningN: 0.013,            // Коэффициент шероховатости по Маннингу
//     minSlope: 0.005,            // Минимальный уклон
//     minDepthRatio: 0.3,         // Минимальное отношение глубины к диаметру
//     maxDepthRatio: 0.8          // Максимальное отношение глубины к диаметру
//   });
  
//   // Initial pipe data
//   const initialPipes = [
//     { 
//       id: 1, 
//       nn1: "A", 
//       nn2: "B", 
//       length: 100, 
//       z1: 10, 
//       z2: 9.5, 
//       qin: 5,
//       qtotal: 0,
//       slope: 0,
//       diameter: 0,
//       velocity: 0,
//       qcapacity: 0,
//       fullness: 0.75
//     }
//   ];

//   const [pipes, setPipes] = useState(initialPipes);
//   const [nextId, setNextId] = useState(2);

//   // Calculate all hydraulic parameters
//   const calculateHydraulics = () => {
//     // First pass: calculate qtotal by accumulating flows
//     const updatedPipes = [...pipes];
    
//     // Initialize all qtotal with their qin
//     updatedPipes.forEach(pipe => {
//       pipe.qtotal = parseFloat(pipe.qin) || 0;
//     });
    
//     // For each pipe, find all upstream pipes and add their qtotal
//     updatedPipes.forEach(pipe => {
//       updatedPipes.forEach(upstreamPipe => {
//         if (upstreamPipe.nn2 === pipe.nn1) {
//           pipe.qtotal += parseFloat(upstreamPipe.qtotal) || 0;
//         }
//       });
//     });
    
//     // Second pass: calculate other hydraulic parameters
//     updatedPipes.forEach(pipe => {
//       // Calculate slope
//       pipe.slope = ((parseFloat(pipe.z1) || 0) - (parseFloat(pipe.z2) || 0)) / (parseFloat(pipe.length) || 1);
//       pipe.slope = Math.max(settings.minSlope, pipe.slope); // Minimum slope
      
//       // Find suitable pipe diameter
//       let selectedDiameter = 0;
//       for (const diameter of pipeDiameters) {
//         // Convert diameter to meters
//         const d = diameter / 1000;
        
//         // Calculate hydraulic radius (R = D/4 for full circular pipe)
//         const r = d / 4;
        
//         // Calculate velocity using Manning's equation
//         const velocity = (1 / settings.manningN) * Math.pow(r, 2/3) * Math.pow(pipe.slope, 1/2);
        
//         // Calculate pipe capacity
//         const area = Math.PI * Math.pow(d, 2) / 4;
//         const capacity = velocity * area * 1000; // L/s
        
//         if (capacity >= pipe.qtotal) {
//           selectedDiameter = diameter;
//           pipe.velocity = velocity;
//           pipe.qcapacity = Math.round(capacity * 100) / 100;
//           break;
//         }
//       }
      
//       pipe.diameter = selectedDiameter;
      
//       // If no suitable diameter found, use the largest available
//       if (pipe.diameter === 0 && pipeDiameters.length > 0) {
//         pipe.diameter = pipeDiameters[pipeDiameters.length - 1];
        
//         // Recalculate velocity and capacity for the largest diameter
//         const d = pipe.diameter / 1000;
//         const r = d / 4;
//         pipe.velocity = (1 / settings.manningN) * Math.pow(r, 2/3) * Math.pow(pipe.slope, 1/2);
//         const area = Math.PI * Math.pow(d, 2) / 4;
//         pipe.qcapacity = Math.round(pipe.velocity * area * 1000 * 100) / 100;
//       }
      
//       // Round values for display
//       pipe.qtotal = Math.round(pipe.qtotal * 100) / 100;
//       pipe.slope = Math.round(pipe.slope * 1000) / 1000;
//       pipe.velocity = Math.round(pipe.velocity * 100) / 100;
//     });
    
//     setPipes(updatedPipes);
//   };

//   // Handle settings change
//   const handleSettingsChange = (field, value) => {
//     setSettings({
//       ...settings,
//       [field]: parseFloat(value)
//     });
//   };

//   // Add a new pipe
//   const addPipe = () => {
//     const newPipe = {
//       id: nextId,
//       nn1: "",
//       nn2: "",
//       length: 0,
//       z1: 0,
//       z2: 0,
//       qin: 0,
//       qtotal: 0,
//       slope: 0,
//       diameter: 0,
//       velocity: 0,
//       qcapacity: 0,
//       fullness: settings.maxDepthRatio
//     };
    
//     setPipes([...pipes, newPipe]);
//     setNextId(nextId + 1);
//   };

//   // Delete a pipe
//   const deletePipe = (id) => {
//     setPipes(pipes.filter(pipe => pipe.id !== id));
//   };

//   // Handle input changes
//   const handleInputChange = (id, field, value) => {
//     const updatedPipes = pipes.map(pipe => {
//       if (pipe.id === id) {
//         return { ...pipe, [field]: value };
//       }
//       return pipe;
//     });
    
//     setPipes(updatedPipes);
//   };

//   // Calculate hydraulics when pipes change
//   useEffect(() => {
//     calculateHydraulics();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Калькулятор канализационной сети</h1>
      
//       {/* Settings Panel */}
//       <div className="mb-6 p-4 border rounded bg-gray-50">
//         <h2 className="text-xl font-bold mb-2">Стандартные настройки</h2>
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Интенсивность осадков (л/с/га):</label>
//             <input 
//               type="number" 
//               value={settings.rainfallIntensity} 
//               onChange={(e) => handleSettingsChange('rainfallIntensity', e.target.value)}
//               className="w-full p-1 border rounded"
//               step="0.1"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Коэффициент стока:</label>
//             <input 
//               type="number" 
//               value={settings.runoffCoefficient} 
//               onChange={(e) => handleSettingsChange('runoffCoefficient', e.target.value)}
//               className="w-full p-1 border rounded"
//               step="0.01"
//               min="0"
//               max="1"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Коэффициент Маннинга (n):</label>
//             <input 
//               type="number" 
//               value={settings.manningN} 
//               onChange={(e) => handleSettingsChange('manningN', e.target.value)}
//               className="w-full p-1 border rounded"
//               step="0.001"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Минимальный уклон:</label>
//             <input 
//               type="number" 
//               value={settings.minSlope} 
//               onChange={(e) => handleSettingsChange('minSlope', e.target.value)}
//               className="w-full p-1 border rounded"
//               step="0.001"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Мин. отношение глубины:</label>
//             <input 
//               type="number" 
//               value={settings.minDepthRatio} 
//               onChange={(e) => handleSettingsChange('minDepthRatio', e.target.value)}
//               className="w-full p-1 border rounded"
//               step="0.1"
//               min="0"
//               max="1"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Макс. отношение глубины:</label>
//             <input 
//               type="number" 
//               value={settings.maxDepthRatio} 
//               onChange={(e) => handleSettingsChange('maxDepthRatio', e.target.value)}
//               className="w-full p-1 border rounded"
//               step="0.1"
//               min="0"
//               max="1"
//             />
//           </div>
//         </div>
//       </div>
      
//       <div className="mb-4">
//         <button 
//           onClick={calculateHydraulics}
//           className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
//         >
//           Рассчитать
//         </button>
        
//         <button 
//           onClick={addPipe}
//           className="bg-green-500 text-white py-2 px-4 rounded"
//         >
//           Добавить трубу
//         </button>
//       </div>
      
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">ID</th>
//               <th className="border p-2">Начальный узел</th>
//               <th className="border p-2">Конечный узел</th>
//               <th className="border p-2">Длина (м)</th>
//               <th className="border p-2">Z1</th>
//               <th className="border p-2">Z2</th>
//               <th className="border p-2">Qвх (л/с)</th>
//               <th className="border p-2">Qобщ (л/с)</th>
//               <th className="border p-2">Уклон (i)</th>
//               <th className="border p-2">Диаметр (мм)</th>
//               <th className="border p-2">Скорость (м/с)</th>
//               <th className="border p-2">Qпропуск (л/с)</th>
//               <th className="border p-2">H/D</th>
//               <th className="border p-2">Действия</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pipes.map(pipe => (
//               <tr key={pipe.id}>
//                 <td className="border p-2">{pipe.id}</td>
//                 <td className="border p-2">
//                   <input 
//                     type="text" 
//                     value={pipe.nn1} 
//                     onChange={(e) => handleInputChange(pipe.id, 'nn1', e.target.value)}
//                     className="w-full p-1 border"
//                   />
//                 </td>
//                 <td className="border p-2">
//                   <input 
//                     type="text" 
//                     value={pipe.nn2} 
//                     onChange={(e) => handleInputChange(pipe.id, 'nn2', e.target.value)}
//                     className="w-full p-1 border"
//                   />
//                 </td>
//                 <td className="border p-2">
//                   <input 
//                     type="number" 
//                     value={pipe.length} 
//                     onChange={(e) => handleInputChange(pipe.id, 'length', e.target.value)}
//                     className="w-full p-1 border"
//                   />
//                 </td>
//                 <td className="border p-2">
//                   <input 
//                     type="number" 
//                     step="0.01"
//                     value={pipe.z1} 
//                     onChange={(e) => handleInputChange(pipe.id, 'z1', e.target.value)}
//                     className="w-full p-1 border"
//                   />
//                 </td>
//                 <td className="border p-2">
//                   <input 
//                     type="number" 
//                     step="0.01"
//                     value={pipe.z2} 
//                     onChange={(e) => handleInputChange(pipe.id, 'z2', e.target.value)}
//                     className="w-full p-1 border"
//                   />
//                 </td>
//                 <td className="border p-2">
//                   <input 
//                     type="number" 
//                     step="0.01"
//                     value={pipe.qin} 
//                     onChange={(e) => handleInputChange(pipe.id, 'qin', e.target.value)}
//                     className="w-full p-1 border"
//                   />
//                 </td>
//                 <td className="border p-2 bg-gray-50">{pipe.qtotal}</td>
//                 <td className="border p-2 bg-gray-50">{pipe.slope}</td>
//                 <td className="border p-2 bg-gray-50">{pipe.diameter}</td>
//                 <td className="border p-2 bg-gray-50">{pipe.velocity}</td>
//                 <td className="border p-2 bg-gray-50">{pipe.qcapacity}</td>
//                 <td className="border p-2 bg-gray-50">{pipe.fullness}</td>
//                 <td className="border p-2">
//                   <button 
//                     onClick={() => deletePipe(pipe.id)}
//                     className="bg-red-500 text-white p-1 rounded"
//                   >
//                     Удалить
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
      
//       <div className="mt-4">
//         <h2 className="text-lg font-bold">Инструкции:</h2>
//         <ul className="list-disc ml-6">
//           <li>Введите данные для каждого сегмента трубы в таблице</li>
//           <li>Начальный узел и Конечный узел определяют направление потока</li>
//           <li>Z1 и Z2 - высотные отметки в начальной и конечной точках</li>
//           <li>Нажмите "Рассчитать" для обновления всех расчетных полей</li>
//           <li>Система автоматически определяет подходящие диаметры труб</li>
//           <li>Доступные диаметры труб: {pipeDiameters.join(', ')} мм</li>
//         </ul>
//       </div>
//     </div>
//   );
// }
