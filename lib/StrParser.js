"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrParser = void 0;
class StrParser {
    constructor(str) {
        this.position = 0;
        this.lastMark = null;
        this.debugMode = false;
        this._onEndChunk = false;
        this.str = str;
    }
    findNext(chunk, skipChunk = false) {
        if (typeof chunk === "string")
            chunk = [chunk];
        // let firstPos : number|null = null;
        let firstPos = 0;
        let firstChunk = null;
        let firstChunkNum = 0;
        let i = 0;
        for (const ch of chunk) {
            const pos = this.str.indexOf(ch, this.position);
            if (pos > 0 && (firstPos === null || pos < firstPos)) {
                firstPos = pos;
                firstChunk = ch;
                firstChunkNum = i;
            }
            i++;
        }
        if (firstChunk) {
            if (skipChunk)
                firstPos += firstChunk.length;
            this.position = firstPos;
            this.lastMark = {
                chunk: firstChunk,
                chunkNum: firstChunkNum,
                position: firstPos
            };
            this._onEndChunk = false;
            this.debug("findNext(" + chunk.join('", "') + ") > '" + firstChunk + "', " + this.position);
            return this.lastMark;
        }
        else {
            this.debug("findNext(" + chunk.join('", "') + ") not found " + this.position);
            return null;
        }
    }
    substring(start = null, stop = null) {
        if (start === null)
            start = this.position;
        else if (typeof start !== "number")
            start = start.position;
        if (stop === null)
            stop = this.str.length;
        else if (typeof stop !== "number")
            stop = stop.position;
        const res = this.str.substring(start, stop);
        this.debug("substr " + start + ":" + stop + " > " + res);
        return res;
    }
    moverel(mov) {
        const newPos = this.position + mov;
        this.position = Math.min(this.str.length, Math.max(0, newPos));
        return { position: this.position };
    }
    pos() {
        return { position: this.position };
    }
    toEndChunk() {
        var _a, _b;
        const l = this._onEndChunk ? 0 : (((_b = (_a = this.lastMark) === null || _a === void 0 ? void 0 : _a.chunk) === null || _b === void 0 ? void 0 : _b.length) || 0);
        this.moverel(l);
        this._onEndChunk = true;
        this.debug("toEndChunk +" + l.toString());
    }
    debug(msg) {
        if (this.debugMode) {
            console.log(msg + "\n		%c" + this.str.substring(0, this.position) + "%c" + this.str.substring(this.position), "background: green; color: white", "color: blue");
        }
    }
    isEnd() {
        return this.position >= this.str.length;
    }
}
exports.StrParser = StrParser;
