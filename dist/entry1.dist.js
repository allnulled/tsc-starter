

  /////////////////////////////////
 // @package: Sun Apr 26 2026 12:15:13 GMT+0200 (hora de verano de Europa central)
// @core: LibsClass
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

 /////////////////////////////////
// @modules:
(function(Libs) {
  Libs.initialize(["test/entries/entry1.js","test/lib/migrations.js","test/lib/orm.js","test/lib/database.js","test/lib/connection.js","test/lib/version.js"]);

    /////////////////////////////////
   // @module: test/lib/version.js
  // @uses 1: test/lib/database.js
  (function(module) {
    try {
      Libs.handleStart(module, false);
      Libs.require("test/lib/database.js");
      
      module.exports = "1.0.0";
    } catch(error) {
      Libs.handleError(error, module);
    } finally {
      Libs.handleFinally(module);
    }
  })({ exports: undefined, id: "test/lib/version.js" });

    /////////////////////////////////
   // @module: test/lib/connection.js
  // @uses 0.
  (function(module) {
    try {
      Libs.handleStart(module, false);
      console.log("This can be sync");
    } catch(error) {
      Libs.handleError(error, module);
    } finally {
      Libs.handleFinally(module);
    }
  })({ exports: undefined, id: "test/lib/connection.js" });

    /////////////////////////////////
   // @module: test/lib/database.js
  // @uses 3: - | test/lib/connection.js | test/lib/version.js
  (async function(module) {
    try {
      Libs.handleStart(module, true);
      // Libs.async()
      
      Libs.require("test/lib/connection.js");
      Libs.require("test/lib/version.js");
    } catch(error) {
      Libs.handleError(error, module);
    } finally {
      Libs.handleFinally(module);
    }
  })({ exports: undefined, id: "test/lib/database.js" });

    /////////////////////////////////
   // @module: test/lib/orm.js
  // @uses 1: test/lib/database.js
  (function(module) {
    try {
      Libs.handleStart(module, false);
      Libs.require("test/lib/database.js");
    } catch(error) {
      Libs.handleError(error, module);
    } finally {
      Libs.handleFinally(module);
    }
  })({ exports: undefined, id: "test/lib/orm.js" });

    /////////////////////////////////
   // @module: test/lib/migrations.js
  // @uses 2: test/lib/orm.js | -
  (async function(module) {
    try {
      Libs.handleStart(module, true);
      Libs.require("test/lib/orm.js");
      Libs.async();
    } catch(error) {
      Libs.handleError(error, module);
    } finally {
      Libs.handleFinally(module);
    }
  })({ exports: undefined, id: "test/lib/migrations.js" });

    /////////////////////////////////
   // @module: test/entries/entry1.js
  // @uses 1: test/lib/migrations.js
  (async function(module) {
    try {
      Libs.handleStart(module, true);
      Libs.require("test/lib/migrations.js");
    } catch(error) {
      Libs.handleError(error, module);
    } finally {
      Libs.handleFinally(module);
    }
  })({ exports: undefined, id: "test/entries/entry1.js" });

})(typeof Libs !== "undefined" ? Libs : new LibsClass());
