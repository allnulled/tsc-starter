import path from "path";
import { fileURLToPath } from "url";
import typescript from "@rollup/plugin-typescript";
import sourceToString from "./commands/utils/rollup-plugins/sourceToString.js";

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

export default {
  input: "src/main.ts",

  output: {
    file: "dist/main.js",
    format: "esm",
  },

  plugins: [
    typescript({
      tsconfig: path.resolve(projectRoot, "tsconfig.json"),
    }),
    sourceToString(),
  ],
};