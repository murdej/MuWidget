"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAdminListItem = void 0;
const IMuWidget_1 = require("./IMuWidget");
class BaseAdminListItem extends IMuWidget_1.IMuWidget {
    afterIndex() {
        this.muRegisterEvent("edit", "delete");
    }
    bDelete_click() {
        if (confirm("Opravdu smazat?" /* + this.ui. + "'"*/))
            this.muDispatchEvent("delete", this.id);
    }
    bEdit_click() {
        this.muDispatchEvent("edit", this.id);
    }
}
exports.BaseAdminListItem = BaseAdminListItem;
