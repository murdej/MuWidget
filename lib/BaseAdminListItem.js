"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAdminListItem = void 0;
var IMuWidget_1 = require("./IMuWidget");
var BaseAdminListItem = /** @class */ (function (_super) {
    __extends(BaseAdminListItem, _super);
    function BaseAdminListItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseAdminListItem.prototype.afterIndex = function () {
        this.muRegisterEvent("edit", "delete");
    };
    BaseAdminListItem.prototype.bDelete_click = function () {
        if (confirm("Opravdu smazat?" /* + this.ui. + "'"*/))
            this.muDispatchEvent("delete", this.id);
    };
    BaseAdminListItem.prototype.bEdit_click = function () {
        this.muDispatchEvent("edit", this.id);
    };
    return BaseAdminListItem;
}(IMuWidget_1.IMuWidget));
exports.BaseAdminListItem = BaseAdminListItem;
