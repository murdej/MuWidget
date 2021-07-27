"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterBootstrap3 = exports.TwitterBootstrap4 = exports.PPFormGroup = void 0;
const MuUIDs_1 = require("./MuUIDs");
class PPFormGroupConfig {
}
;
class PPFormGroup extends PPFormGroupConfig {
    preproc(element) {
        element.className += " " + this.getConfigValue("containerCssClass");
        const input = element.firstElementChild;
        const id = MuUIDs_1.MuUIDs.next("id");
        input.className += " " + this.getConfigValue("inputCssClass");
        input.id = id;
        // input.parentElement.removeChild(input);
        // this.input = input;
        const label = document.createElement("label");
        label.className = this.getConfigValue("labelCssClass");
        label.htmlFor = id;
        label.innerText = this.label || element.getAttribute("label");
        const inputContainer = document.createElement("div");
        inputContainer.className = this.getConfigValue("inputContainerCssClass");
        while (element.firstChild) {
            const subEl = element.firstChild;
            subEl.parentElement.removeChild(subEl);
            inputContainer.appendChild(subEl);
        }
        const errorMessage = document.createElement("div");
        errorMessage.className = this.getConfigValue("errorCssClass");
        errorMessage.innerText = "Test error";
        input["errorMessageElement"] = errorMessage;
        input["formGroupElement"] = element;
        inputContainer.appendChild(errorMessage);
        element.appendChild(label);
        element.appendChild(inputContainer);
    }
    getConfigValue(k) {
        let v;
        if (k in this)
            v = this[k];
        else
            v = PPFormGroup.defaultConfig[k];
        if (typeof v == "function")
            v = v(this);
        return v;
    }
}
exports.PPFormGroup = PPFormGroup;
PPFormGroup.defaultConfig = new PPFormGroupConfig();
function TwitterBootstrap4(config, labelSize = 4) {
    config.containerCssClass = "row mb-3";
    config.labelCssClass = (fg) => "col-sm-" + fg.getConfigValue("labelSize") + " col-form-label";
    config.inputContainerCssClass = (fg) => "col-sm-" + (12 - fg.getConfigValue("labelSize"));
    config.labelSize = labelSize;
    config.inputCssClass = "form-control";
    config.errorCssClass = "invalid-feedback";
}
exports.TwitterBootstrap4 = TwitterBootstrap4;
function TwitterBootstrap3(config, labelSize = 4) {
    config.containerCssClass = "row mb-3";
    config.labelCssClass = (fg) => "col-sm-" + fg.getConfigValue("labelSize") + " col-form-label";
    config.inputContainerCssClass = (fg) => "col-sm-" + (12 - fg.getConfigValue("labelSize"));
    config.labelSize = labelSize;
    config.inputCssClass = "form-control";
    config.errorCssClass = "invalid-feedback";
}
exports.TwitterBootstrap3 = TwitterBootstrap3;
