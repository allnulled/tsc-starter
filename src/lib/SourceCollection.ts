import Compilation from "./Compilation/Compilation.ts";
import { PackageDescriptor } from "./Compilation/utils/PackageDescriptor.ts";
import trace from "./trace.ts";

export default class SourceCollection {

    compilation: Compilation;

    package:PackageDescriptor;

    constructor(compilation: Compilation) {
        trace("SourceCollection.constructor", arguments);
        this.compilation = compilation;
        this.package = {};
    }

};