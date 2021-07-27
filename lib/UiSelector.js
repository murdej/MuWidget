"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiSelector = void 0;
const IMuWidget_1 = require("./IMuWidget");
class UiSelector extends IMuWidget_1.IMuWidget {
    constructor() {
        super(...arguments);
        this.items = {};
        this.cssClassActive = "active";
        this.containerTag = "span";
        this.bindItemValues = null;
        this.containerCssClass = "";
        this.textField = "text";
        this.valueField = "value";
        this.onchange = null;
        this.value = null;
    }
    getActive() {
        return this.value;
    }
    setActive(value) {
        this.value = value;
        for (const el of this.container.children) {
            if (el.value == value)
                el.classList.add(this.cssClassActive);
            else
                el.classList.remove(this.cssClassActive);
        }
    }
    bindValues(items) {
        this.container.innerHTML = "";
        for (let item of items) {
            this.addItem(item);
            this.items[item[this.valueField]] = item;
        }
    }
    addItem(item, before = null) {
        const el = document.createElement(this.containerTag);
        const v = item[this.valueField];
        if (this.containerCssClass)
            el.className = this.containerCssClass;
        el.value = v;
        item.element = el;
        el.addEventListener("click", (ev) => {
            this.setActive(v);
            const sev = {
                originalEvent: ev,
                item: item,
                value: v,
                sender: this
            };
            if (this.onchange)
                this.onchange(sev);
            this.muDispatchEvent("change", sev);
        });
        // el.innerText = item.text;
        const itemBinder = this.bindItemValues || ((item, container) => container.innerText = item[this.textField]);
        itemBinder(item, el);
        if (before === null) {
            this.container.appendChild(el);
        }
        else {
            let bel;
            if (before === "first")
                bel = this.container.firstChild;
            else
                bel = this.items[before];
            this.container.insertBefore(el, bel);
        }
    }
    afterIndex() {
        this.muRegisterEvent("change");
    }
}
exports.UiSelector = UiSelector;
/*
export type SelectorBindOpts = {
    containerTag? : string,
    containerCssClass? : string,
    bindValues? : (item : SelectorItem, container : HTMLElement) => void,
    textField?: string,
    valueField?: string
} */ 
