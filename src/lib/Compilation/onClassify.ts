import fullprint from "../fullprint.ts";
import trace from "../trace.ts";
import Compilation from "./Compilation.ts";

export default function onClassify (this:Compilation) {
  trace("Compilation.prototype.onClassify", arguments);
  // @EN-BLANCO a propósito para más adelante añadir comprobaciones
};