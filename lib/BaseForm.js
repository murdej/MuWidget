"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseForm = void 0;
const IMuWidget_1 = require("./IMuWidget");
class BaseForm extends IMuWidget_1.IMuWidget {
    afterIndex() {
        this.muRegisterEvent("save", "cancel");
    }
    showErrors(errors = {}) {
        let hError;
        for (const id in this.ui) {
            let field;
            let hError;
            if (id.startsWith("error-")) {
                field = id.substr(6);
                hError = this.ui[id];
            }
            else if (this.ui[id]["errorMessageElement"]) {
                field = id;
                hError = this.ui[id]["errorMessageElement"];
            }
            if (!field)
                continue;
            hError.innerHTML = "";
            const hasError = field in errors;
            hError.style.display = hasError ? null : "none";
            const input = this.ui[field];
            input.classList.toggle("is-invalid", hasError);
            if (hasError) {
                const hList = document.createElement("ul");
                hError.appendChild(hList);
                for (const message of errors[field]) {
                    const hMessage = document.createElement("li");
                    hMessage.innerText = message;
                    hList.appendChild(hMessage);
                }
            }
        }
    }
    bSave_click() { this.muDispatchEvent("save", this.id); }
    bCancel_click() { this.muDispatchEvent("cancel"); }
    visible(visible) {
        this.container.style.display = visible ? null : "none";
    }
    setFormMode(formMode) {
        this.formMode = formMode;
    }
    afterLoad() { }
}
exports.BaseForm = BaseForm;
