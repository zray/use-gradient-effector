import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import autoExternal from "rollup-plugin-auto-external";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";

import pkg from "./package.json";

export default {
  input: "src/index.js",
  external: ["uuid", "@alchemyalcove/rgb-to-hsl"],
  globals: { uuid: "uuid", "@alchemyalcove/rgb-to-hsl": "Convert" },
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
    external(),
    url({ exclude: ["**/*.svg"] }),
    babel({
      exclude: "node_modules/**"
    }),
    resolve({
      modulesOnly: true
    }),
    commonjs({
      namedExports: {
        uuid: ["uuid"],
        "@alchemyalcove/rgb-to-hsl": ["Convert"]
      }
    }),
    autoExternal()
  ]
};
