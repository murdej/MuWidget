"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuUIDs = void 0;
class MuUIDs {
    static next(k) {
        MuUIDs.counters[k]++;
        return MuUIDs.prefix + MuUIDs.counters[k].toString();
    }
}
exports.MuUIDs = MuUIDs;
MuUIDs.counters = {
    id: 0,
    name: 0
};
MuUIDs.prefix = "_Mu_";
