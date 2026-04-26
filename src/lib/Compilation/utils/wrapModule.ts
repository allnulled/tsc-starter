import trace from "../../trace";
import { ModuleDescriptor } from "./ModuleDescriptor";

export default function(moduleDescriptor:ModuleDescriptor, forceAsync:boolean = false):{ js:string, isAsync:boolean } {
  trace("Compilation.utils.wrapModule", arguments);
  const isAsync = forceAsync || (moduleDescriptor.dependencies.filter(dep => dep.subtype === "async").length !== 0);
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
  return { js, isAsync };
};