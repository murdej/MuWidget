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
exports.BaseAdminCRUD = void 0;
var IMuWidget_1 = require("./IMuWidget");
var App_1 = require("./App");
var BaseAdminCRUD = /** @class */ (function (_super) {
    __extends(BaseAdminCRUD, _super);
    function BaseAdminCRUD() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseAdminCRUD.prototype.afterIndex = function () {
        var _this = this;
        this.editor = this.muNamedWidget.editor;
        this.list = this.muNamedWidget.list;
        this.app = this.muParent["app"];
        this.editor.visible(false);
        setTimeout(function () { return _this.listLoad(); }, 1);
    };
    BaseAdminCRUD.prototype.bReload_click = function () {
        this.listLoad();
    };
    BaseAdminCRUD.prototype.item_edit = function (sender, ev, id) {
        var _this = this;
        this.itemLoad(id, function (data) {
            _this.editor.showErrors();
            _this.editor.muBindData(data);
            _this.editor.visible(true);
            _this.editor.container.scrollIntoView();
            _this.editor.setFormMode("edit");
            _this.editor.afterLoad();
        });
    };
    BaseAdminCRUD.prototype.bAdd_click = function (sender, ev, id) {
        this.editor.showErrors();
        this.editor.muBindData(this.getEmptyItem());
        this.editor.visible(true);
        this.editor.container.scrollIntoView();
        this.editor.setFormMode("new");
        this.editor.afterLoad();
    };
    BaseAdminCRUD.prototype.item_delete = function (sender, ev, id) {
    };
    BaseAdminCRUD.prototype.editor_save = function (sender, ev, id) {
        var _this = this;
        this.itemSave(id, this.editor.muFetchData(), function (data) {
            if (data.success) {
                _this.editor.visible(false);
                _this.listLoad();
                App_1.App.instance.flashMessage.add("Uloženo");
                _this.afterSaved(data);
            }
            else if (data.errors) {
                _this.editor.showErrors(data.errors);
                App_1.App.instance.flashMessage.add("Zadané údaje obsahují chybu.");
            }
        });
    };
    BaseAdminCRUD.prototype.editor_cancel = function (sender, ev, id) {
        this.editor.visible(false);
    };
    BaseAdminCRUD.prototype.afterSaved = function (data) { };
    return BaseAdminCRUD;
}(IMuWidget_1.IMuWidget));
exports.BaseAdminCRUD = BaseAdminCRUD;
