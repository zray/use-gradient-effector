import { useRef, useEffect, useState } from "react";
// import RGBtoHSL from "@alchemyalcove/rgb-to-hsl";
import { v4 as uuid } from "uuid";

const RGBtoHSL = rgb => {
  var r = rgb[0] / 255;
  var g = rgb[1] / 255;
  var b = rgb[2] / 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var delta = max - min;
  var h = void 0;
  var s = void 0;
  var l = void 0;

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  l = (min + max) / 2;

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return [h, s * 100, l * 100];
};

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
          const hslValue = RGBtoHSL([
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
