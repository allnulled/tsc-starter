function trace(identity, args) {
  {
    console.log(`[trace] [${identity}] ${Array.from(args || []).map(el => typeof el).join(",")}`);
  }
}

class SourceCollection {
  constructor(compilation) {
    trace("SourceCollection.constructor", arguments);
    this.compilation = compilation;
    this.package = {};
  }
}

class SourceGeneration {
  js = "";
  css = "";
  constructor() {
    trace("SourceGeneration.constructor", arguments);
  }
}

async function onCollect() {
  trace("Compilation.prototype.onCollect", arguments);
  const alreadyKnown = [
    // @AQUI INYECTAR LOS MÓDULOS CARGADOS POR CONTEXTO
  ];
  const modules = {};
  let modulesCounter = 0;
  const initializeModule = function (file, source) {
    if (!(file in modules)) {
      modules[file] = {
        id: file,
        source: source,
        dependencies: [],
        order: modulesCounter++
      };
    }
  };
  const collectInnerResources = async (sourceInput, userFile, userIndexes = []) => {
    trace("Compilation.prototype.onCollect / collectInnerResources", arguments);
    if (userFile === "-") {
      return false;
    }
    const file = this.compiler.resolveRelative(userFile);
    const source = sourceInput || (await this.compiler.fetch(file));
    const matchesList = this.utils.extractMatches(source, file);
    initializeModule(file, source);
    for (let index = 0; index < matchesList.length; index++) {
      const matchDescriptor = matchesList[index];
      const target = matchDescriptor.mentionRelative;
      if (!alreadyKnown.includes(target)) {
        alreadyKnown.push(target);
        // @AQUÍ VALIDACIONES, pero la recursividad se permite porque simplemente accedes a un módulo indefinido o en forma de promesa
        if (userIndexes.includes(target)) {
          throw new Error(`Recursive «Libs.require» call to «${target}» started from file «${file}» on «Compilation.prototype.onCollect»`);
        }
        await collectInnerResources(null, target, userIndexes.concat([target]));
      }
      modules[file].dependencies.push(matchDescriptor);
    }
  };
  await collectInnerResources(this.seed, this.file, []);
  this.collection.package = modules;
  return modules;
}

function onClassify() {
  trace("Compilation.prototype.onClassify", arguments);
  // @EN-BLANCO a propósito para más adelante añadir comprobaciones
}

function onGenerate() {
  trace("Compilation.prototype.onGenerate", arguments);
  let js = "";
  const allModules = this.collection.package;
  const sortedModules = Object.keys(allModules).sort(function (k1, k2) {
    return allModules[k1].order >= allModules[k2].order ? -1 : 1;
  });
  let isPackageAsync = false;
  let counter = 0;
  Object.values(this.collection.package);
  const lastModuleIndex = sortedModules.length;
  for (let prop of sortedModules) {
    counter++;
    const moduleDescriptor = allModules[prop];
    const {
      js: moreJs,
      isAsync: isModuleAsync
    } = this.utils.wrapModule(moduleDescriptor, lastModuleIndex === counter && isPackageAsync);
    isPackageAsync = isPackageAsync || isModuleAsync;
    js += moreJs;
  }
  js = this.utils.wrapPackage(js, this.collection.package);
  this.output.js = js;
}

const MAGIC_REGEX = /Libs\.(require|async)(\( *"([^"]*)"\))?/g;
function extractMatches(source, file) {
  trace("Compilation.prototype.utils.extractMatches", arguments);
  const regexMatches = source.matchAll(MAGIC_REGEX);
  const matches = [];
  let counterInFile = 0;
  for (let it of regexMatches) {
    const [match, ...groups] = it;
    const subtype = groups[0];
    const parameters = groups[1];
    const mention = parameters ? groups[2] : "-";
    const item = {
      type: "MatchDescriptor",
      subtype: subtype,
      fileRelative: this.compiler.resolveRelative(file),
      file: file,
      fileFull: this.compiler.resolveAbsolute(file),
      mentionRelative: this.compiler.resolveRelative(mention),
      mention: mention,
      mentionFull: this.compiler.resolveAbsolute(mention),
      match: match,
      size: match.length,
      pos: it.index,
      count: this.counters.matches++,
      countPerFile: counterInFile++
    };
    matches.push(item);
  }
  return matches;
}

function wrapModule (moduleDescriptor, forceAsync = false) {
  trace("Compilation.utils.wrapModule", arguments);
  const isAsync = forceAsync || moduleDescriptor.dependencies.filter(dep => dep.subtype === "async").length !== 0;
  let js = "";
  js += `\n`;
  js += `    /////////////////////////////////\n`;
  js += `   // @module: ${moduleDescriptor.id}\n`;
  js += `  // @uses ${moduleDescriptor.dependencies.length}${!moduleDescriptor.dependencies.length ? "." : ": " + moduleDescriptor.dependencies.map(dep => dep.mentionRelative).join(" | ")}\n`;
  js += `  (${isAsync ? "async " : ""}function(module) {\n`;
  js += `    try {\n`;
  js += `      Libs.handleStart(module, ${isAsync ? "true" : "false"});\n`;
  js += `${moduleDescriptor.source.split("\n").map(line => " ".repeat(6) + line).join("\n")}\n`;
  js += `    } catch(error) {\n`;
  js += `      Libs.handleError(error, module);\n`;
  js += `    } finally {\n`;
  js += `      Libs.handleFinally(module);\n`;
  js += `    }\n`;
  js += `  })({ exports: undefined, id: ${JSON.stringify(moduleDescriptor.id)} });\n`;
  return {
    js,
    isAsync
  };
}

function wrapPackage (innerJs, packageDescriptor) {
  trace("Compilation.utils.wrapPackage", arguments);
  let js = "\n\n";
  js += `  /////////////////////////////////\n`;
  js += ` // @package: ${new Date()}\n`;
  js += `// @core: LibsClass\n`;
  js += "if(typeof LibClass === \"undefined\") {\n  LibsClass = class {\n    modules = {};\n    constructor() {}\n    handleStart(mod, isAsync = false) {\n      console.log(`[libs] started ${isAsync ? \"async \" : \"\"}\"${mod.id}\"`);\n    }\n    handleError(error, mod) {\n      console.error(`[libs] error loading \"${mod.id}\"`);\n      throw error;\n    }\n    handleFinally(mod) {\n      this.modules[mod.id] = mod.export;\n      console.log(`[libs] finished \"${mod.id}\"`);\n    }\n    require(id) {\n      if(Array.isArray(id)) return id.map(subid => this.require(subid));\n      if(!(id in this.modules)) {\n        throw new Error(`Module not found «${id}» on «Libs.require»`);\n      }\n      return this.modules[id];\n    }\n    release(id) {\n      if(Array.isArray(id)) return id.forEach(subid => this.release(subid));\n      delete this.modules[id];\n    }\n    async(id = undefined) {\n      if(typeof id === \"undefined\") return \"Okay\";\n      return this.require(id);\n    }\n    initialize(keys) {\n      for(let index=0; index<keys.length; index++) {\n        const key = keys[index];\n        this.modules[key] = undefined;\n      }\n    }\n  };\n}";
  js += `\n\n /////////////////////////////////\n`;
  js += `// @modules:\n`;
  js += `(function(Libs) {\n`;
  js += `  Libs.initialize(${JSON.stringify(Object.keys(packageDescriptor))});\n`;
  js += `${innerJs}\n`;
  js += `})(typeof Libs !== "undefined" ? Libs : new LibsClass());\n`;
  return js;
}

class SourceClassifiction {
  constructor(compilation) {
    trace("SourceClassifiction.constructor", arguments);
    this.compilation = compilation;
  }
}

class Compilation {
  milliseconds = false;
  counters = {
    matches: 0,
    modules: 0
  };
  utils = {
    extractMatches: extractMatches.bind(this),
    wrapModule: wrapModule.bind(this),
    wrapPackage: wrapPackage.bind(this)
  };
  constructor(seed, file = "(unnamed root)", compiler) {
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
    if (this.isStarted) {
      throw new Error("Compilation was already started");
    }
    this.isStarted = new Date();
  }
  end() {
    trace("Compilation.prototype.end", arguments);
    this.isFinished = new Date();
    this.milliseconds = this.isFinished.getTime() - this.isStarted.getTime();
  }
  onCollect = onCollect;
  onClassify = onClassify;
  onGenerate = onGenerate;
}

const Environment = {
  hasWindow: typeof window !== "undefined",
  hasDocument: typeof document !== "undefined",
  hasGlobal: typeof global !== "undefined",
  hasModule: typeof module !== "undefined",
  hasProcess: typeof process !== "undefined"
};
Object.assign(Environment, {
  isNodejs: Environment.hasGlobal && Environment.hasProcess && Environment.hasModule,
  isBrowser: Environment.hasWindow && Environment.hasDocument,
  isNwjs: Environment.hasGlobal && Environment.hasProcess && Environment.hasModule && Environment.hasWindow && Environment.hasDocument
});

class Compiler {
  constructor(basedir = null) {
    trace("Compiler.constructor", arguments);
    this.basedir = (() => {
      if (Environment.isBrowser) {
        if (basedir === null) return window.location.href;
        if (basedir !== null) return basedir;
      }
      if (basedir === null) return process.cwd();
      return require("path").resolve(basedir);
    })();
  }
  compile(target) {
    trace("Compiler.prototype.compile", arguments);
    return this.fetch(target).then(source => {
      return this.compileSource(source, target);
    });
  }
  async compileSource(source, file = "(unnamed root)") {
    trace("Compiler.prototype.compileSource", arguments);
    const compilation = new Compilation(source, file, this);
    await compilation.start();
    return compilation;
  }
  resolveRelative(...args) {
    trace("Compiler.prototype.resolve", arguments);
    let normalized = Environment.isNodejs ? require("path").resolve(this.basedir, ...args) : this.basedir + "/" + args.join("/");
    normalized = this.basedir ? normalized.replace(this.basedir + "/", "") : normalized;
    return normalized;
  }
  resolveAbsolute(...args) {
    trace("Compiler.prototype.resolve", arguments);
    return Environment.isNodejs ? require("path").resolve(this.basedir, ...args) : this.basedir + "/" + args.join("/");
  }
  async fetchByAjax(target) {
    trace("Compiler.fetchByAjax", arguments);
    const normalized = this.resolveAbsolute(target);
    return fetch(normalized).then(response => {
      return response.text();
    });
  }
  fetchByFile(target) {
    trace("Compiler.fetchByFile", arguments);
    const normalized = this.resolveAbsolute(target);
    return require("fs").promises.readFile(normalized, "utf8");
  }
  fetch(target) {
    trace("Compiler.fetch", arguments);
    return Environment.isNodejs ? this.fetchByFile(target) : this.fetchByAjax(target);
  }
  static create(basedir = null) {
    trace("Compiler.create", arguments);
    return new Compiler(basedir);
  }
}

const main = async function () {
  console.log("Started");
  const compilation1 = await Compiler.create(__dirname + "/..").compile("test/entries/entry1.js");
  // fullprint(compilation1.collection.package,"-compilation");
  const target1 = __dirname + "/entry1.dist.js";
  require("fs").writeFileSync(target1, compilation1.output.js, "utf8");
  require(target1);

  // const compilation2:Compilation = await Compiler.create(__dirname + "/..").compile("test/cases/errors/Recursive dependency between 2 modules is not allowed.js");
  // console.log("JAVASCREEEPT:", compilation2.output.js);
  // debug(compilation2.classification.dependencies.registered,"-compilation");
  // debug(compilation2.collection.matches,"-compilation");

  // const compilation3:Compilation = await Compiler.create(__dirname + "/..").compile("test/cases/errors/Sync and async to same file is not allowed.js");
  // debug(compilation3.classification.dependencies.registered,"-compilation");

  console.log("Ended");
};
main();
