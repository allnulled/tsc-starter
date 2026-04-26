import Compilation from "../Compilation.ts";
import trace from "../../trace.ts";
import type { MatchDescriptor } from "./MatchDescriptor.ts";

const MAGIC_REGEX = /Libs\.(require|async)(\( *"([^"]*)"\))?/g;

export default function extractMatches (this: Compilation, source: string, file: string): Array<MatchDescriptor> {
    trace("Compilation.prototype.utils.extractMatches", arguments);
    const regexMatches = source.matchAll(MAGIC_REGEX);
    const matches:Array<MatchDescriptor> = [];
    let counterInFile = 0;
    Extract_matches:
    for (let it of regexMatches) {
        const [match, ...groups] = it;
        const subtype = groups[0];
        const parameters = groups[1];
        const mention = parameters ? groups[2] : "-";
        const item: MatchDescriptor = {
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
            countPerFile: counterInFile++,
        };
        matches.push(item);
    }
    return matches;
};