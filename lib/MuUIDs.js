"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuUIDs = void 0;
var MuUIDs = /** @class */ (function () {
    function MuUIDs() {
    }
    MuUIDs.next = function (k) {
        MuUIDs.counters[k]++;
        return MuUIDs.prefix + MuUIDs.counters[k].toString();
    };
    MuUIDs.counters = {
        id: 0,
        name: 0
    };
    MuUIDs.prefix = "_Mu_";
    return MuUIDs;
}());
exports.MuUIDs = MuUIDs;
