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
exports.BaseForm = void 0;
var IMuWidget_1 = require("./IMuWidget");
var BaseForm = /** @class */ (function (_super) {
    __extends(BaseForm, _super);
    function BaseForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseForm.prototype.afterIndex = function () {
        this.muRegisterEvent("save", "cancel");
    };
    BaseForm.prototype.showErrors = function (errors) {
        if (errors === void 0) { errors = {}; }
        var hError;
        for (var id in this.ui) {
            var field = void 0;
            var hError_1 = void 0;
            if (id.startsWith("error-")) {
                field = id.substr(6);
                hError_1 = this.ui[id];
            }
            else if (this.ui[id]["errorMessageElement"]) {
                field = id;
                hError_1 = this.ui[id]["errorMessageElement"];
            }
            if (!field)
                continue;
            hError_1.innerHTML = "";
            var hasError = field in errors;
            hError_1.style.display = hasError ? null : "none";
            var input = this.ui[field];
            input.classList.toggle("is-invalid", hasError);
            if (hasError) {
                var hList = document.createElement("ul");
                hError_1.appendChild(hList);
                for (var _i = 0, _a = errors[field]; _i < _a.length; _i++) {
                    var message = _a[_i];
                    var hMessage = document.createElement("li");
                    hMessage.innerText = message;
                    hList.appendChild(hMessage);
                }
            }
        }
    };
    BaseForm.prototype.bSave_click = function () { this.muDispatchEvent("save", this.id); };
    BaseForm.prototype.bCancel_click = function () { this.muDispatchEvent("cancel"); };
    BaseForm.prototype.visible = function (visible) {
        this.container.style.display = visible ? null : "none";
    };
    BaseForm.prototype.setFormMode = function (formMode) {
        this.formMode = formMode;
    };
    BaseForm.prototype.afterLoad = function () { };
    return BaseForm;
}(IMuWidget_1.IMuWidget));
exports.BaseForm = BaseForm;
