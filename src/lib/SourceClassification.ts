import Compilation from "./Compilation/Compilation.ts";
import DependencyManager from "./Compilation/utils/DependencyManager.ts";
import trace from "./trace.ts";

export default class SourceClassifiction {

  compilation: Compilation;

  constructor(compilation: Compilation) {
    trace("SourceClassifiction.constructor", arguments);
    this.compilation = compilation;
  }

};