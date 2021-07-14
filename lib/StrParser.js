"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrParser = void 0;
var StrParser = /** @class */ (function () {
    function StrParser(str) {
        this.position = 0;
        this.lastMark = null;
        this._onEndChunk = false;
        this.str = str;
    }
    StrParser.prototype.findNext = function (chunk, skipChunk) {
        if (skipChunk === void 0) { skipChunk = false; }
        if (typeof chunk === "string")
            chunk = [chunk];
        var firstPos = null;
        var firstChunk;
        var firstChunkNum;
        var i = 0;
        for (var _i = 0, chunk_1 = chunk; _i < chunk_1.length; _i++) {
            var ch = chunk_1[_i];
            var pos = this.str.indexOf(ch, this.position);
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
    };
    StrParser.prototype.substring = function (start, stop) {
        if (start === void 0) { start = null; }
        if (stop === void 0) { stop = null; }
        if (start === null)
            start = this.position;
        else if (typeof start !== "number")
            start = start.position;
        if (stop === null)
            stop = this.str.length;
        else if (typeof stop !== "number")
            stop = stop.position;
        var res = this.str.substring(start, stop);
        this.debug("substr " + start + ":" + stop + " > " + res);
        return res;
    };
    StrParser.prototype.moverel = function (mov) {
        var newPos = this.position + mov;
        this.position = Math.min(this.str.length, Math.max(0, newPos));
        return { position: this.position };
    };
    StrParser.prototype.pos = function () {
        return { position: this.position };
    };
    StrParser.prototype.toEndChunk = function () {
        var _a;
        var l = this._onEndChunk ? 0 : (((_a = this.lastMark) === null || _a === void 0 ? void 0 : _a.chunk.length) || 0);
        this.moverel(l);
        this._onEndChunk = true;
        this.debug("toEndChunk +" + l.toString());
    };
    StrParser.prototype.debug = function (msg) {
        if (this.debugMode) {
            console.log(msg + "\n		%c" + this.str.substring(0, this.position) + "%c" + this.str.substring(this.position), "background: green; color: white", "color: blue");
        }
    };
    StrParser.prototype.isEnd = function () {
        return this.position >= this.str.length;
    };
    return StrParser;
}());
exports.StrParser = StrParser;
