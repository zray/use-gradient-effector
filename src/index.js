import { useRef, useEffect, useState } from "react";
import Convert from "@alchemyalcove/rgb-to-hsl";
import uuid from "uuid";

const useGradientEffector = ({
  dimensions: { width, height } = {},
  position: { x, y } = {},
  // falloff, TODO: add non-linear gradient ramp for radial gradient
  innerRadius = 1,
  outerRadius,
  columns = 4,
  rows = 3
}) => {
  const [gradientValues, setGradientValues] = useState();
  const canvasRef = useRef(null);

  // Draw canvas
  useEffect(() => {
    // If dimensions, then draw offscreen with matching width and height
    if (width && height && !canvasRef.current) {
      canvasRef.current = new OffscreenCanvas(width, height);
    }

    // If canvas exists, create gradient
    if (canvasRef.current) {
      // Draw gradient
      const gradientEnd = outerRadius || height > width ? height : width;
      const offscreen = canvasRef.current.getContext("2d");
      // Create gradient
      const gradient = offscreen.createRadialGradient(
        x,
        y,
        1,
        x,
        y,
        gradientEnd
      );

      // Add color stops
      gradient.addColorStop(0, "#000");
      gradient.addColorStop(1, "#fff");

      // Set the fill style and draw a rectangle
      offscreen.fillStyle = gradient;
      offscreen.fillRect(0, 0, width, height);
    }
  }, [width, height, innerRadius, outerRadius, x, y]);

  // Get colour value
  useEffect(() => {
    // Empty array to hold values
    const newGradientValues = [];

    if (canvasRef.current) {
      const offscreen = canvasRef.current.getContext("2d");
      // Loop through columns and rows to get computed value
      for (let sampleColumn = 0; sampleColumn < columns; sampleColumn += 1) {
        for (let sampleRow = 0; sampleRow < rows; sampleRow += 1) {
          const sampleX = (width / columns) * sampleColumn;
          const sampleY = (height / rows) * sampleRow;
          const newGradientValue = offscreen.getImageData(
            sampleX,
            sampleY,
            1,
            1
          );

          // Convert to HSL
          const hslValue = Convert([
            newGradientValue.data[0],
            newGradientValue.data[1],
            newGradientValue.data[2]
          ]);

          // Package output
          const output = {
            hue: hslValue[0],
            saturation: hslValue[2],
            lightness: hslValue[2],
            key: uuid()
          };

          // Push into array
          newGradientValues.push(output);
        }
      }
    }

    setGradientValues(newGradientValues);
  }, [columns, rows, width, height, x, y]);

  return gradientValues;
};

export { useGradientEffector };
