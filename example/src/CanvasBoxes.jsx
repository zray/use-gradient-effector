import React, { useRef, useState, useEffect } from "react";
import { useGradientEffector } from "use-gradient-effector";

// Example styles
import styles from "./styles.module.scss";

// Dummy position for initial state
const initialPosition = { x: 25, y: 25 };
const config = {
  columns: 12,
  rows: 9
};

const App = () => {
  const [dimensions, setDimensions] = useState();
  const [position, setPosition] = useState(initialPosition);
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
  }, [setDimensions]);

  const mouseHandler = e => {
    setPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawBox = ({ column, row }) => {
      const columnWidth = dimensions.width / config.columns;
      const rowHeight = dimensions.height / config.rows;
      const data = shaderOutput[column * row];
      const fillObject = {
        x: column * columnWidth,
        y: row * rowHeight,
        width: columnWidth,
        height: rowHeight,
        color: `hsl(0, 0%, ${data.lightness}%)`
      };
      console.log(fillObject);
      ctx.fillStyle = fillObject.color;

      ctx.fillRect(
        fillObject.x,
        fillObject.y,
        fillObject.width,
        fillObject.height
      );
    };

    ctx.fillStyle = "#000";
    // ctx.beginPath();
    if (dimensions && dimensions.width && dimensions.height) {
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }
    ctx.fillStyle = "#fff";

    if (shaderOutput && shaderOutput.length) {
      ctx.save();
      for (let column = 0; column < config.columns; column += 1) {
        for (let row = 0; row < config.rows; row += 1) {
          drawBox({ column, row });
        }
      }
      ctx.restore();
    }
    ctx.fill();
  }, [shaderOutput, dimensions, config]);

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
