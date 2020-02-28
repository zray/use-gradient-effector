import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import url from "@rollup/plugin-url";
import babel from "rollup-plugin-babel";

import pkg from "./package.json";

export default {
  input: "src/index.js",
  externals: ["uuid"],
  globals: { react: "React" },
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs({
      include: "node_modules/**",
      namedExports: {
        react: ["useState", "useRef", "useEffect"]
      }
    }),
    peerDepsExternal(),
    babel({
      exclude: "node_modules/**"
    }),
    url({ exclude: ["**/*.svg"] })
  ]
};
