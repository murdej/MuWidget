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
exports.UiSelector = void 0;
var IMuWidget_1 = require("./IMuWidget");
var UiSelector = /** @class */ (function (_super) {
    __extends(UiSelector, _super);
    function UiSelector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.items = {};
        _this.cssClassActive = "active";
        _this.containerTag = "span";
        _this.containerCssClass = "";
        _this.textField = "text";
        _this.valueField = "value";
        return _this;
    }
    UiSelector.prototype.getActive = function () {
        return this.value;
    };
    UiSelector.prototype.setActive = function (value) {
        this.value = value;
        for (var _i = 0, _a = this.container.children; _i < _a.length; _i++) {
            var el = _a[_i];
            if (el.value == value)
                el.classList.add(this.cssClassActive);
            else
                el.classList.remove(this.cssClassActive);
        }
    };
    UiSelector.prototype.bindValues = function (items) {
        this.container.innerHTML = "";
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            this.addItem(item);
            this.items[item[this.valueField]] = item;
        }
    };
    UiSelector.prototype.addItem = function (item, before) {
        var _this = this;
        if (before === void 0) { before = null; }
        var el = document.createElement(this.containerTag);
        var v = item[this.valueField];
        if (this.containerCssClass)
            el.className = this.containerCssClass;
        el.value = v;
        item.element = el;
        el.addEventListener("click", function (ev) {
            _this.setActive(v);
            var sev = {
                originalEvent: ev,
                item: item,
                value: v,
                sender: _this
            };
            if (_this.onchange)
                _this.onchange(sev);
            _this.muDispatchEvent("change", sev);
        });
        // el.innerText = item.text;
        var itemBinder = this.bindItemValues || (function (item, container) { return container.innerText = item[_this.textField]; });
        itemBinder(item, el);
        if (before === null) {
            this.container.appendChild(el);
        }
        else {
            var bel = void 0;
            if (before === "first")
                bel = this.container.firstChild;
            else
                bel = this.items[before];
            this.container.insertBefore(el, bel);
        }
    };
    UiSelector.prototype.afterIndex = function () {
        this.muRegisterEvent("change");
    };
    return UiSelector;
}(IMuWidget_1.IMuWidget));
exports.UiSelector = UiSelector;
/*
export type SelectorBindOpts = {
    containerTag? : string,
    containerCssClass? : string,
    bindValues? : (item : SelectorItem, container : HTMLElement) => void,
    textField?: string,
    valueField?: string
} */ 
