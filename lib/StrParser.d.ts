export declare class StrParser {
    protected str: string;
    position: number;
    lastMark: StrParserMark;
    debugMode: boolean;
    constructor(str: string);
    findNext(chunk: string | string[], skipChunk?: boolean): StrParserMark | null;
    substring(start?: StrParserMark | number | null, stop?: StrParserMark | number | null): string;
    moverel(mov: number): StrParserMark;
    pos(): {
        position: number;
    };
    protected _onEndChunk: boolean;
    toEndChunk(): void;
    protected debug(msg: any): void;
    isEnd(): boolean;
}
export declare type StrParserMark = {
    chunk?: string;
    chunkNum?: number;
    position: number;
};
