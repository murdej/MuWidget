"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiFlashMessage = exports.UiFlashMessageContainer = void 0;
const IMuWidget_1 = require("./IMuWidget");
class UiFlashMessageContainer extends IMuWidget_1.IMuWidget {
    afterIndex() {
        this.updateVisibility();
    }
    updateVisibility() {
        this.container.style.display = this.ui.items.firstElementChild
            ? null
            : "none";
    }
    add(text) {
        var item = this.muWidgetFromTemplate("item", "items", { text: text });
        this.updateVisibility();
        return item;
    }
}
exports.UiFlashMessageContainer = UiFlashMessageContainer;
class UiFlashMessage extends IMuWidget_1.IMuWidget {
    afterIndex() {
        if (this.text)
            this.ui.text.innerText = this.text;
    }
    remove() {
        this.muRemoveSelf();
        this.muParent.updateVisibility();
    }
    bClose_click() {
        this.remove();
    }
}
exports.UiFlashMessage = UiFlashMessage;
