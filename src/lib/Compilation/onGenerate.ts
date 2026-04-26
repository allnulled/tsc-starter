import debug from "../debug";
import trace from "../trace";
import Compilation from "./Compilation";
import { ModuleDescriptor } from "./utils/ModuleDescriptor";

export default function onGenerate (this: Compilation) {
    trace("Compilation.prototype.onGenerate", arguments);
    let js:string = "";
    const allModules = this.collection.package;
    const sortedModules = Object.keys(allModules).sort(function(k1, k2) {
      return allModules[k1].order >= allModules[k2].order ? -1 : 1;
    });
    let isPackageAsync:boolean = false;
    let counter = 0;
    const items = Object.values(this.collection.package);
    const lastModuleIndex = sortedModules.length;
    for(let prop of sortedModules) {
      counter++;
      const moduleDescriptor:ModuleDescriptor = allModules[prop];
      const { js: moreJs, isAsync: isModuleAsync } = this.utils.wrapModule(moduleDescriptor, (lastModuleIndex === counter) && isPackageAsync);
      isPackageAsync = isPackageAsync || isModuleAsync;
      js += moreJs;
    }
    js = this.utils.wrapPackage(js, this.collection.package);
    this.output.js = js;
};