import Compiler from "./lib/Compiler.ts";
import Compilation from "./lib/Compilation/Compilation.ts";
import debug from "./lib/debug.ts";
import fullprint from "./lib/fullprint.ts";

declare const __dirname:string;
declare const require:Function;

const main = async function() {
  
  console.log("Started");

  const compilation1:Compilation = await Compiler.create(__dirname + "/..").compile("test/entries/entry1.js");
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