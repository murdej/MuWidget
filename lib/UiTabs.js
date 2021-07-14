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
exports.UiTabs = void 0;
var IMuWidget_1 = require("./IMuWidget");
var UiTabs = /** @class */ (function (_super) {
    __extends(UiTabs, _super);
    function UiTabs() {
        // public tabIds : string[];
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.labelAtributeName = "tab-label";
        _this.tabLabels = {};
        _this.liClassName = "nav-item";
        _this.aClassName = "nav-link";
        _this.aActiveClassName = "nav-link active";
        return _this;
    }
    UiTabs.prototype.afterIndex = function () {
        var _this = this;
        this.container.className = "nav nav-tabs";
        this.muParent.muOnAfterIndex.push(function () { return _this.makeTabs(); });
    };
    UiTabs.prototype.makeTabs = function () {
        var _this = this;
        this.container.innerHTML = "";
        var firstMuId = null;
        var _loop_1 = function (muId) {
            var tabContent = this_1.muParent.ui[muId];
            var label = tabContent.getAttribute(this_1.labelAtributeName);
            if (label === null)
                return "continue";
            if (firstMuId == null)
                firstMuId = muId;
            var hLi = document.createElement("li");
            hLi.className = this_1.liClassName;
            var hA = document.createElement("span");
            hA.addEventListener("click", function () {
                _this.selectTab(muId);
                if (_this.onSelectTab)
                    _this.onSelectTab(muId);
            });
            hA.innerText = label;
            hLi.appendChild(hA);
            this_1.tabLabels[muId] = hA;
            this_1.container.appendChild(hLi);
        };
        var this_1 = this;
        for (var muId in this.muParent.ui) {
            _loop_1(muId);
        }
        this.selectTab(firstMuId);
    };
    UiTabs.prototype.selectTab = function (selectedMuId) {
        for (var muId in this.tabLabels) {
            var tabLabel = this.tabLabels[muId];
            var isActive = selectedMuId === muId;
            tabLabel.className = isActive ? this.aActiveClassName : this.aClassName;
            this.muParent.muVisible(isActive, muId);
            if (isActive)
                this.selectedTabId = muId;
        }
    };
    return UiTabs;
}(IMuWidget_1.IMuWidget));
exports.UiTabs = UiTabs;
