import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import sourceToString from "./utils/rollup-plugins/sourceToString.js";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const inputFile = path.resolve(projectRoot, "src/main.ts");
const outputFile = path.resolve(projectRoot, "dist/main.js");
const tsConfig = JSON.parse(fs.readFileSync(path.resolve(projectRoot, "tsconfig.json"), "utf8"));

console.log(tsConfig);


/*
const bundle = await rollup({
  input: inputFile,
  plugins: [
    resolve({
      extensions: [".js", ".ts"]
    }),
    typescript({
      tsconfig: path.resolve(projectRoot, "tsconfig.json")
    }),
    sourceToString(),
  ],
});
//*/

const bundle = await rollup({
  input: inputFile,
  plugins: [
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
      ]
    }),
  ],
});

await bundle.write({
  file: outputFile,
  format: "esm",
  sourcemap: false,
});