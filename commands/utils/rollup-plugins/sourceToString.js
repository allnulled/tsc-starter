import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import generateModule from "@babel/generator";

const { default: traverse } = traverseModule;
const { default: generate } = generateModule;

export default function sourceToString() {
  return {
    name: "source-to-string",
    transform(code, id) {
      if (!/\.(ts|js)$/.test(id)) return null;
      if (!code.includes("source`")) return null;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      let changed = false;
      traverse(ast, {
        TaggedTemplateExpression(pathNode) {
          const node = pathNode.node;
          if (
            node.tag.type !== "Identifier" ||
            node.tag.name !== "source"
          ) return;
          const filePath = node.quasi.quasis[0].value.cooked;
          const abs = path.resolve(path.dirname(id), filePath);
          const content = fs.readFileSync(abs, "utf8");
          pathNode.replaceWithSourceString(
            JSON.stringify(content)
          );
          changed = true;
        },
      });
      if (!changed) return null;
      return {
        code: generate(ast, {}, code).code,
        map: null,
      };
    },
  };
};