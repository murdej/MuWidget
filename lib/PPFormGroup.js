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
exports.TwitterBootstrap3 = exports.TwitterBootstrap4 = exports.PPFormGroup = void 0;
var MuUIDs_1 = require("./MuUIDs");
var PPFormGroupConfig = /** @class */ (function () {
    function PPFormGroupConfig() {
    }
    return PPFormGroupConfig;
}());
;
var PPFormGroup = /** @class */ (function (_super) {
    __extends(PPFormGroup, _super);
    function PPFormGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PPFormGroup.prototype.preproc = function (element) {
        element.className += " " + this.getConfigValue("containerCssClass");
        var input = element.firstElementChild;
        var id = MuUIDs_1.MuUIDs.next("id");
        input.className += " " + this.getConfigValue("inputCssClass");
        input.id = id;
        // input.parentElement.removeChild(input);
        // this.input = input;
        var label = document.createElement("label");
        label.className = this.getConfigValue("labelCssClass");
        label.htmlFor = id;
        label.innerText = this.label || element.getAttribute("label");
        var inputContainer = document.createElement("div");
        inputContainer.className = this.getConfigValue("inputContainerCssClass");
        while (element.firstChild) {
            var subEl = element.firstChild;
            subEl.parentElement.removeChild(subEl);
            inputContainer.appendChild(subEl);
        }
        var errorMessage = document.createElement("div");
        errorMessage.className = this.getConfigValue("errorCssClass");
        errorMessage.innerText = "Test error";
        input["errorMessageElement"] = errorMessage;
        input["formGroupElement"] = element;
        inputContainer.appendChild(errorMessage);
        element.appendChild(label);
        element.appendChild(inputContainer);
    };
    PPFormGroup.prototype.getConfigValue = function (k) {
        var v;
        if (k in this)
            v = this[k];
        else
            v = PPFormGroup.defaultConfig[k];
        if (typeof v == "function")
            v = v(this);
        return v;
    };
    PPFormGroup.defaultConfig = new PPFormGroupConfig();
    return PPFormGroup;
}(PPFormGroupConfig));
exports.PPFormGroup = PPFormGroup;
function TwitterBootstrap4(config, labelSize) {
    if (labelSize === void 0) { labelSize = 4; }
    config.containerCssClass = "row mb-3";
    config.labelCssClass = function (fg) { return "col-sm-" + fg.getConfigValue("labelSize") + " col-form-label"; };
    config.inputContainerCssClass = function (fg) { return "col-sm-" + (12 - fg.getConfigValue("labelSize")); };
    config.labelSize = labelSize;
    config.inputCssClass = "form-control";
    config.errorCssClass = "invalid-feedback";
}
exports.TwitterBootstrap4 = TwitterBootstrap4;
function TwitterBootstrap3(config, labelSize) {
    if (labelSize === void 0) { labelSize = 4; }
    config.containerCssClass = "row mb-3";
    config.labelCssClass = function (fg) { return "col-sm-" + fg.getConfigValue("labelSize") + " col-form-label"; };
    config.inputContainerCssClass = function (fg) { return "col-sm-" + (12 - fg.getConfigValue("labelSize")); };
    config.labelSize = labelSize;
    config.inputCssClass = "form-control";
    config.errorCssClass = "invalid-feedback";
}
exports.TwitterBootstrap3 = TwitterBootstrap3;
