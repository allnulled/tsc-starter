import trace from "../../trace";
import { PackageDescriptor } from "./PackageDescriptor";

export default function(innerJs:string, packageDescriptor:PackageDescriptor):string {
  trace("Compilation.utils.wrapPackage", arguments);
  let js = "\n\n";
  js += `  /////////////////////////////////\n`;
  js += ` // @package: ${new Date()}\n`;
  js += `// @core: LibsClass\n`;
  js += source`../sources/LibsClass.js`;
  js += `\n\n /////////////////////////////////\n`;
  js += `// @modules:\n`;
  js += `(function(Libs) {\n`;
  js += `  Libs.initialize(${JSON.stringify(Object.keys(packageDescriptor))});\n`;
  js += `${innerJs}\n`;
  js += `})(typeof Libs !== "undefined" ? Libs : new LibsClass());\n`;
  return js;
};