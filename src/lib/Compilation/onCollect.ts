import Compilation from "./Compilation.ts";
import type { MatchDescriptor } from "./utils/MatchDescriptor.ts";
import type { ModuleDescriptor } from "./utils/ModuleDescriptor.ts";
import type { PackageDescriptor } from "./utils/PackageDescriptor.ts";
import trace from "../trace.ts";

export default async function onCollect(this: Compilation): Promise<ModuleDescriptor> {
  trace("Compilation.prototype.onCollect", arguments);
  const alreadyKnown: string[] = [
    // @AQUI INYECTAR LOS MÓDULOS CARGADOS POR CONTEXTO
  ];
  const modules: PackageDescriptor = {};
  let modulesCounter: number = 0;
  const initializeModule = function (file:string, source:string) {
    if (!(file in modules)) {
      modules[file] = {
        id: file,
        source: source,
        dependencies: [],
        order: modulesCounter++,
      };
    }
  };
  const collectInnerResources = async (sourceInput: string | null, userFile: string, userIndexes: Array<string> = []) => {
    trace("Compilation.prototype.onCollect / collectInnerResources", arguments);
    if(userFile === "-") {
      return false;
    }
    const file: string = this.compiler.resolveRelative(userFile);
    const source: string = sourceInput || await this.compiler.fetch(file);
    const matchesList: Array<MatchDescriptor> = this.utils.extractMatches(source, file);
    initializeModule(file, source);
    Iterating_matches:
    for (let index = 0; index < matchesList.length; index++) {
      const matchDescriptor: MatchDescriptor = matchesList[index];
      const target = matchDescriptor.mentionRelative;
      if (!alreadyKnown.includes(target)) {
        alreadyKnown.push(target);
        // @AQUÍ VALIDACIONES, pero la recursividad se permite porque simplemente accedes a un módulo indefinido o en forma de promesa
        if(userIndexes.includes(target)) {
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
};