import Compilation from "./Compilation/Compilation.ts";
import Environment from "./Environment.ts";
import trace from "./trace.ts";

declare const __dirname: string;
declare const process: any;
declare const require: Function;
declare const fetch: Function;

export default class Compiler {

  basedir: string;

  constructor(basedir: string | null = null) {
    trace("Compiler.constructor", arguments);
    this.basedir = (():string => {
      if (Environment.isBrowser) {
        if (basedir === null) return window.location.href;
        if (basedir !== null) return basedir;
      }
      if (basedir === null) return process.cwd();
      return require("path").resolve(basedir);
    })();
  }

  compile(target: string): Promise<Compilation> {
    trace("Compiler.prototype.compile", arguments);
    return this.fetch(target).then((source: string) => {
      return this.compileSource(source, target);
    });
  }

  async compileSource(source: string, file: string = "(unnamed root)"): Promise<Compilation> {
    trace("Compiler.prototype.compileSource", arguments);
    const compilation: Compilation = new Compilation(source, file, this);
    await compilation.start();
    return compilation;
  }

  resolveRelative(...args: Array<string>): string {
    trace("Compiler.prototype.resolve", arguments);
    let normalized = Environment.isNodejs ? require("path").resolve(this.basedir, ...args) : this.basedir + "/" + args.join("/");
    normalized = this.basedir ? normalized.replace(this.basedir + "/", "") : normalized;
    return normalized;
  }

  resolveAbsolute(...args: Array<string>): string {
    trace("Compiler.prototype.resolve", arguments);
    return Environment.isNodejs ? require("path").resolve(this.basedir, ...args) : this.basedir + "/" + args.join("/");
  }

  async fetchByAjax(target: string): Promise<string> {
    trace("Compiler.fetchByAjax", arguments);
    const normalized = this.resolveAbsolute(target);
    return fetch(normalized).then((response: any) => {
      return response.text();
    });
  }

  fetchByFile(target: string): Promise<string> {
    trace("Compiler.fetchByFile", arguments);
    const normalized = this.resolveAbsolute(target);
    return require("fs").promises.readFile(normalized, "utf8");
  }

  fetch(target: string): Promise<string> {
    trace("Compiler.fetch", arguments);
    return Environment.isNodejs ? this.fetchByFile(target) : this.fetchByAjax(target);
  }

  static create(basedir: string | null = null): Compiler {
    trace("Compiler.create", arguments);
    return new Compiler(basedir);
  }

};