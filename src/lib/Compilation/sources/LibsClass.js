if(typeof LibClass === "undefined") {
  LibsClass = class {
    modules = {};
    constructor() {}
    handleStart(mod, isAsync = false) {
      console.log(`[libs] started ${isAsync ? "async " : ""}"${mod.id}"`);
    }
    handleError(error, mod) {
      console.error(`[libs] error loading "${mod.id}"`);
      throw error;
    }
    handleFinally(mod) {
      this.modules[mod.id] = mod.export;
      console.log(`[libs] finished "${mod.id}"`);
    }
    require(id) {
      if(Array.isArray(id)) return id.map(subid => this.require(subid));
      if(!(id in this.modules)) {
        throw new Error(`Module not found «${id}» on «Libs.require»`);
      }
      return this.modules[id];
    }
    release(id) {
      if(Array.isArray(id)) return id.forEach(subid => this.release(subid));
      delete this.modules[id];
    }
    async(id = undefined) {
      if(typeof id === "undefined") return "Okay";
      return this.require(id);
    }
    initialize(keys) {
      for(let index=0; index<keys.length; index++) {
        const key = keys[index];
        this.modules[key] = undefined;
      }
    }
  };
}