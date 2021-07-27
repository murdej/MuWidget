"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAttributes = exports.IMuWidget = void 0;
const MuWidget_1 = require("./MuWidget");
const MuBinder_1 = require("./MuBinder");
class IMuWidget // extends MuWidget
 {
    constructor() {
        this.ui = {};
        this.muBindOpts = {};
    }
    muWidgetFromTemplate(templateName, container, params = null, addMethod = "appendChild") { return null; }
    ;
    muRemoveSelf() { }
    ;
    muGetChildWidgets(container) {
        if (typeof container === "string")
            container = this.ui[container];
        return MuWidget_1.MuWidget.getChildWidgets(container);
    }
    muBindList(list, templateName, container, commonParams = null, finalCalback = null) { }
    muVisible(state, control) { }
    muAddEvent(eventName, element, callback) { }
    muBindData(srcData) {
        MuBinder_1.MuBinder.bindData(this.muBindOpts, srcData, this);
        this.muAfterBindData();
    }
    muFetchData() {
        return MuBinder_1.MuBinder.fetchData(this.muBindOpts, this);
    }
    muDispatchEvent(name, ...args) { }
    muRegisterEvent(...args) { }
    addEventListener(name, handler) { }
    muEventNames() { return []; }
    muAfterBindData() { }
}
exports.IMuWidget = IMuWidget;
function SetAttributes(element, attrs) {
    for (const n in attrs) {
        element.setAttribute(n, attrs[n].toString());
    }
}
exports.SetAttributes = SetAttributes;
