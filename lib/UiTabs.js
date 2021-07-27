"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiTabs = void 0;
const IMuWidget_1 = require("./IMuWidget");
class UiTabs extends IMuWidget_1.IMuWidget {
    constructor() {
        // public tabIds : string[];
        super(...arguments);
        this.labelAtributeName = "tab-label";
        this.tabLabels = {};
        this.liClassName = "nav-item";
        this.aClassName = "nav-link";
        this.aActiveClassName = "nav-link active";
        this.onSelectTab = null;
        this.selectedTabId = null;
    }
    afterIndex() {
        var _a;
        this.container.className = "nav nav-tabs";
        (_a = this.muParent) === null || _a === void 0 ? void 0 : _a.muOnAfterIndex.push(() => this.makeTabs());
    }
    makeTabs() {
        this.container.innerHTML = "";
        let firstMuId = null;
        if (this.muParent) {
            for (let muId in this.muParent.ui) {
                const tabContent = this.muParent.ui[muId];
                let label = tabContent.getAttribute(this.labelAtributeName);
                if (label === null)
                    continue;
                if (firstMuId == null)
                    firstMuId = muId;
                const hLi = document.createElement("li");
                hLi.className = this.liClassName;
                const hA = document.createElement("span");
                hA.addEventListener("click", () => {
                    this.selectTab(muId);
                    if (this.onSelectTab)
                        this.onSelectTab(muId);
                });
                hA.innerText = label;
                hLi.appendChild(hA);
                this.tabLabels[muId] = hA;
                this.container.appendChild(hLi);
            }
            if (firstMuId)
                this.selectTab(firstMuId);
        }
    }
    selectTab(selectedMuId) {
        var _a;
        for (let muId in this.tabLabels) {
            const tabLabel = this.tabLabels[muId];
            let isActive = selectedMuId === muId;
            tabLabel.className = isActive ? this.aActiveClassName : this.aClassName;
            (_a = this.muParent) === null || _a === void 0 ? void 0 : _a.muVisible(isActive, muId);
            if (isActive)
                this.selectedTabId = muId;
        }
    }
}
exports.UiTabs = UiTabs;
