import Compiler from "../Compiler.ts";
import SourceCollection from "../SourceCollection.ts";
import SourceGeneration from "../SourceGeneration.ts";
import trace from "../trace.ts";
import onCollect from "./onCollect.ts";
import onClassify from "./onClassify.ts";
import onGenerate from "./onGenerate.ts";
import extractMatches from "./utils/extractMatches.ts";
import wrapModule from "./utils/wrapModule.ts";
import wrapPackage from "./utils/wrapPackage.ts";
import SourceClassifiction from "../SourceClassification.ts";

export default class Compilation {

  isStarted: Date | undefined;
  
  isFinished: Date | undefined;

  milliseconds: boolean|number = false;

  seed: string;

  file: string;

  compiler: Compiler;

  collection: SourceCollection;

  classification: SourceClassifiction;

  output: SourceGeneration;

  counters: { matches:number, modules:number } = {
    matches: 0,
    modules: 0,
  };

  utils = {
    extractMatches: extractMatches.bind(this),
    wrapModule: wrapModule.bind(this),
    wrapPackage: wrapPackage.bind(this),
  };

  constructor(seed: string, file: string = "(unnamed root)", compiler: Compiler) {
    trace("Compilation.constructor", arguments);
    this.compiler = compiler;
    this.seed = seed;
    this.file = file;
    this.collection = new SourceCollection(this);
    this.classification = new SourceClassifiction(this);
    this.output = new SourceGeneration();
  }

  async start() {
    trace("Compilation.prototype.start", arguments);
    // Bloqueamos para que la compilación sea usable 1 vez solamente:
    this.lock();
    // Descargamos por orden recursivo los ficheros:
    await this.onCollect();
    // Aplicamos la clasificación para obtener la lista de waves y pasar los checks de paso:
    await this.onClassify();
    // Generamos cómodamente el js:
    await this.onGenerate();
    // Cerramos el estado de compilación terminada:
    this.end();
    // Devolvemos la compilación resuelta
    return this;
  }

  lock() {
    trace("Compilation.prototype.lock", arguments);
    if(this.isStarted) {
      throw new Error("Compilation was already started");
    }
    this.isStarted = new Date();
  }

  end() {
    trace("Compilation.prototype.end", arguments);
    this.isFinished = new Date();
    this.milliseconds = this.isFinished.getTime() - this.isStarted!.getTime();
  }

  onCollect = onCollect;

  onClassify = onClassify;

  onGenerate = onGenerate;

};