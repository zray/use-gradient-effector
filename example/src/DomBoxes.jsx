import React, { useRef, useState, useEffect } from "react";
import { useGradientEffector } from "use-gradient-effector";
import cn from "classnames";

// Example styles
import styles from "./styles.module.scss";

// Dummy position for initial state
const initialPosition = { x: 25, y: 25 };
const config = {
  columns: 8,
  rows: 6
};

const App = () => {
  const [dimensions, setDimensions] = useState();
  const [position, setPosition] = useState(initialPosition);
  const gradientRef = useRef(null);
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

  return (
    <div
      className={styles.container}
      ref={gradientRef}
      onMouseMove={mouseHandler}
    >
      <div className={styles.boxes}>
        {shaderOutput &&
          shaderOutput.map(({ hue, lightness, key }) => {
            const colorString = `hsl(${hue}, 0%, ${lightness}%)`;
            return (
              <div
                className={cn(styles.box, {
                  [styles.hover]: lightness < 20
                })}
                style={{
                  "--sample-color": colorString,
                  "--sample-columns": config.columns,
                  "--sample-rows": config.rows
                }}
                key={key}
              />
            );
          })}
      </div>
    </div>
  );
};
export default App;
