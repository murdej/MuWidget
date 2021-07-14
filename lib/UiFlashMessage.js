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
exports.UiFlashMessage = exports.UiFlashMessageContainer = void 0;
var IMuWidget_1 = require("./IMuWidget");
var UiFlashMessageContainer = /** @class */ (function (_super) {
    __extends(UiFlashMessageContainer, _super);
    function UiFlashMessageContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UiFlashMessageContainer.prototype.afterIndex = function () {
        this.updateVisibility();
    };
    UiFlashMessageContainer.prototype.updateVisibility = function () {
        this.container.style.display = this.ui.items.firstElementChild
            ? null
            : "none";
    };
    UiFlashMessageContainer.prototype.add = function (text) {
        var item = this.muWidgetFromTemplate("item", "items", { text: text });
        this.updateVisibility();
        return item;
    };
    return UiFlashMessageContainer;
}(IMuWidget_1.IMuWidget));
exports.UiFlashMessageContainer = UiFlashMessageContainer;
var UiFlashMessage = /** @class */ (function (_super) {
    __extends(UiFlashMessage, _super);
    function UiFlashMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UiFlashMessage.prototype.afterIndex = function () {
        if (this.text)
            this.ui.text.innerText = this.text;
    };
    UiFlashMessage.prototype.remove = function () {
        this.muRemoveSelf();
        this.muParent.updateVisibility();
    };
    UiFlashMessage.prototype.bClose_click = function () {
        this.remove();
    };
    return UiFlashMessage;
}(IMuWidget_1.IMuWidget));
exports.UiFlashMessage = UiFlashMessage;
