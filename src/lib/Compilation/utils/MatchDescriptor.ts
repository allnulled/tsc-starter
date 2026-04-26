export type MatchDescriptor = {
    type: string;
    subtype: string;
    mention: string,
    mentionRelative: string,
    mentionFull: string,
    file: string,
    fileRelative: string,
    fileFull: string,
    match: string;
    size: number;
    pos: number;
    count: number;
    countPerFile: number;
};