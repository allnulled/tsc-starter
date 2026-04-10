import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { rollup } from "rollup";
import sourceToString from "./utils/rollup-plugins/sourceToString.js";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import alias from "@rollup/plugin-alias";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const inputFile = path.resolve(projectRoot, "src/main.ts");
const outputFile = path.resolve(projectRoot, "dist/main.js");

const bundle = await rollup({
  input: inputFile,
  plugins: [
    alias({
      entries: [{
        find: "{src}",
        replacement: path.resolve(projectRoot, "src"),
      }, {
        find: "{root}",
        replacement: path.resolve(projectRoot),
      }],
    }),
    resolve({
      extensions: [".js", ".ts"]
    }),
    sourceToString(),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".ts"],
      presets: [
        [
          "@babel/preset-env", {
            targets: {
              // esmodules: true,
              node: "20"
            }
          }
        ],
        "@babel/preset-typescript"
      ],
      plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }]
      ]
    }),
  ],
});

await bundle.write({
  file: outputFile,
  format: "esm",
  sourcemap: false,
});