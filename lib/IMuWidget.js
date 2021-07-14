"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAttributes = exports.IMuWidget = void 0;
var MuWidget_1 = require("./MuWidget");
var MuBinder_1 = require("./MuBinder");
var IMuWidget // extends MuWidget
 = /** @class */ (function () {
    function IMuWidget() {
        this.ui = {};
        this.muBindOpts = {};
    }
    IMuWidget.prototype.muWidgetFromTemplate = function (templateName, container, params, addMethod) {
        if (params === void 0) { params = null; }
        if (addMethod === void 0) { addMethod = "appendChild"; }
        return null;
    };
    ;
    IMuWidget.prototype.muRemoveSelf = function () { };
    ;
    IMuWidget.prototype.muGetChildWidgets = function (container) {
        if (typeof container === "string")
            container = this.ui[container];
        return MuWidget_1.MuWidget.getChildWidgets(container);
    };
    IMuWidget.prototype.muBindList = function (list, templateName, container, commonParams, finalCalback) {
        if (commonParams === void 0) { commonParams = null; }
        if (finalCalback === void 0) { finalCalback = null; }
    };
    IMuWidget.prototype.muVisible = function (state, control) { };
    IMuWidget.prototype.muAddEvent = function (eventName, element, callback) { };
    IMuWidget.prototype.muBindData = function (srcData) {
        MuBinder_1.MuBinder.bindData(this.muBindOpts, srcData, this);
        this.muAfterBindData();
    };
    IMuWidget.prototype.muFetchData = function () {
        return MuBinder_1.MuBinder.fetchData(this.muBindOpts, this);
    };
    IMuWidget.prototype.muDispatchEvent = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    IMuWidget.prototype.muRegisterEvent = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    IMuWidget.prototype.addEventListener = function (name, handler) { };
    IMuWidget.prototype.muEventNames = function () { return []; };
    IMuWidget.prototype.muAfterBindData = function () { };
    return IMuWidget;
}());
exports.IMuWidget = IMuWidget;
function SetAttributes(element, attrs) {
    for (var n in attrs) {
        element.setAttribute(n, attrs[n].toString());
    }
}
exports.SetAttributes = SetAttributes;
