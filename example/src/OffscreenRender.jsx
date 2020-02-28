import React, { useRef, useState, useEffect } from "react";
import { useGradientEffector } from "use-gradient-effector";

// Example styles
import styles from "./styles.module.scss";

// Dummy position for initial state
const initialPosition = { x: 25, y: 25 };
const config = {
  columns: 24,
  rows: 16,
  depth: 100
};

const App = () => {
  const [dimensions, setDimensions] = useState();
  const [position, setPosition] = useState(initialPosition);
  const [columnWidth, setColumnWidth] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  const gradientRef = useRef(null);
  const canvasRef = useRef(null);
  const shaderOutput = useGradientEffector({
    dimensions,
    position,
    columns: config.columns,
    rows: config.rows
  });

  useEffect(() => {
    const DOMNode = gradientRef.current;
    const width = DOMNode.offsetWidth;
    const height = DOMNode.offsetHeight;
    setDimensions({ width, height });
    setColumnWidth(Math.floor(width / config.columns));
    setRowHeight(Math.floor(height / config.rows));
  }, [setDimensions]);

  const mouseHandler = e => {
    setPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Render tiles offscreen so we can select depending on lightness
  const offscreenRef = useRef(null);
  useEffect(() => {
    if (!offscreenRef.current && columnWidth && rowHeight) {
      offscreenRef.current = Array(config.depth).fill();
      for (let i = 0; i < config.depth; i += 1) {
        offscreenRef.current[i] = new OffscreenCanvas(columnWidth, rowHeight);
        const offScreenContext = offscreenRef.current[i].getContext("2d");
        offScreenContext.fillStyle = `hsl(0,0%,${i + 1}%)`;
        offScreenContext.fillRect(0, 0, columnWidth, rowHeight);
      }
    }
  }, [columnWidth, rowHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    const drawImage = ({ column, row }) => {
      const data = shaderOutput[column * row];
      const flooredLightness = Math.floor(data.lightness);
      const fillObject = {
        x: column * columnWidth,
        y: row * rowHeight,
        width: columnWidth,
        height: rowHeight,
        color: `hsl(0, 0%, ${flooredLightness}%)`
      };

      ctx.drawImage(
        offscreenRef.current[flooredLightness],
        fillObject.x,
        fillObject.y,
        fillObject.width,
        fillObject.height
      );
    };

    ctx.fillStyle = "#000";
    if (dimensions && dimensions.width && dimensions.height) {
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }
    ctx.fillStyle = "#fff";

    if (shaderOutput && shaderOutput.length) {
      ctx.save();
      for (let column = 0; column < config.columns; column += 1) {
        for (let row = 0; row < config.rows; row += 1) {
          drawImage({ column, row });
        }
      }
      ctx.restore();
    }
    ctx.fill();
  }, [shaderOutput, dimensions, columnWidth, rowHeight]);

  return (
    <div
      className={styles.container}
      ref={gradientRef}
      onMouseMove={mouseHandler}
    >
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        width={dimensions ? dimensions.width : 100}
        height={dimensions ? dimensions.height : 100}
      />
    </div>
  );
};
export default App;
