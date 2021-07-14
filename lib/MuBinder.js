"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuBinder = void 0;
var StrParser_1 = require("./StrParser");
var MuBinder = /** @class */ (function () {
    function MuBinder() {
    }
    MuBinder.parse = function (src, element) {
        /*
        source
        source:target
        source::target
        source;target
        sourcer|filter():target
        */
        var mode;
        var optsList = [];
        var sp = new StrParser_1.StrParser(src);
        var p;
        var lastP = 0;
        function parseFetchBind(chunk, opts) {
            switch (chunk) {
                case ":":
                case "::":
                case "^":
                    opts.forBind = chunk != "^";
                    opts.forFetch = chunk != ":";
                    return true;
                case ";":
                    mode = "complete";
                    opts.forBind = true;
                    opts.forFetch = false;
                    return true;
                default:
                    return false;
            }
        }
        function parseFilter(sp, bindPart, opts) {
            p = sp.findNext(["::", ":", "|", "^", ";", "("]);
            var filter = {
                methodName: sp.substring(lastP, p).trim(),
                args: []
            };
            if (!p) {
                mode = "end";
            }
            else if (p.chunk === ";") {
                mode = "complete";
                sp.toEndChunk();
            }
            else {
                sp.toEndChunk();
                lastP = sp.position;
                if (p.chunk === "(") {
                    var argStart = sp.pos();
                    while (true) {
                        p = sp.findNext([")", "\""]);
                        if (p === null)
                            throw "missing ')' after argument(s) '" + src + "'";
                        if (p.chunk == ")") {
                            sp.toEndChunk();
                            lastP = sp.position;
                            break;
                        }
                        // skoč na konec stringu
                        sp.toEndChunk();
                        do {
                            p = sp.findNext(["\\\"", "\""]);
                            if (p === null)
                                throw "unterminated string '" + src + "'";
                            sp.toEndChunk();
                        } while (p.chunk === "\\\"");
                    }
                    var sArgs = sp.substring(argStart, p);
                    try {
                        filter.args = JSON.parse("[" + sArgs + "]");
                    }
                    catch (exc) {
                        throw "Invalid arguments - " + exc.toString() + " '" + sArgs + "'";
                    }
                }
                mode = parseFetchBind(p.chunk, opts) ? "target" : (bindPart ? "bindFilter" : "fetchFilter");
                // sp.toEndChunk();
                lastP = sp.position;
            }
            return filter.methodName ? filter : null;
        }
        while (!sp.isEnd() && mode != "end") {
            mode = "source";
            var opts = {
                element: element,
                source: null,
                target: null,
                bindFilters: [],
                fetchFilters: [],
                forBind: null,
                forFetch: null
            };
            // sp.debugMode = true;
            while (mode != "complete" && mode != "end") {
                switch (mode) {
                    case "source":
                        p = sp.findNext(["::", ":", "|", ";", "^"]);
                        opts.source = sp.substring(lastP, p).trim();
                        if (!p) {
                            mode = "end";
                        }
                        else if (p.chunk == ";") {
                            mode = "complete";
                        }
                        else {
                            mode = parseFetchBind(p.chunk, opts) ? "target" : "bindFilter";
                            sp.toEndChunk();
                            lastP = sp.position;
                        }
                        break;
                    case "target":
                        p = sp.findNext(["|", ";"]);
                        opts.target = sp.substring(lastP, p).trim();
                        if (!p) {
                            mode = "end";
                        }
                        else if (p.chunk == ";") {
                            mode = "complete";
                        }
                        else {
                            mode = "fetchFilter";
                            sp.toEndChunk();
                            lastP = sp.position;
                        }
                        break;
                    case "bindFilter":
                        var f = parseFilter(sp, true, opts);
                        if (f)
                            opts.bindFilters.push(f);
                        break;
                    case "fetchFilter":
                        f = parseFilter(sp, false, opts);
                        if (f)
                            opts.fetchFilters.push(f);
                        break;
                }
            }
            optsList.push(opts);
            sp.toEndChunk();
            lastP = sp.position;
        }
        return optsList;
    };
    MuBinder.setDefaults = function (mbo) {
        var defaults = {};
        // mbo.element.hasAttribute("mu-widget")
        if (mbo.element.hasAttribute("mu-widget")) {
            defaults.forBind = true;
            defaults.forFetch = true;
            defaults.target = "@widget";
        }
        else if (mbo.element instanceof HTMLInputElement || mbo.element instanceof HTMLTextAreaElement || mbo.element instanceof HTMLSelectElement) {
            if (mbo.element.type === "file") {
                defaults.forBind = false;
                defaults.forFetch = true;
                defaults.target = "files";
            }
            else {
                defaults.forBind = true;
                defaults.forFetch = true;
                if (mbo.element.type === "checkbox")
                    defaults.target = "checked";
                else
                    defaults.target = "value";
            }
        }
        else if (mbo.element instanceof HTMLImageElement || mbo.element instanceof HTMLAudioElement || mbo.element instanceof HTMLVideoElement) {
            defaults.forBind = true;
            defaults.forFetch = false;
            defaults.target = "src";
        }
        else {
            defaults.forBind = true;
            defaults.forFetch = false;
            defaults.target = "text";
        }
        for (var k in defaults) {
            if (mbo[k] === null)
                mbo[k] = defaults[k];
        }
        var targetAlias = {
            text: "innerText",
            html: "innerHTML"
        };
        if (targetAlias[mbo.target])
            mbo.target = targetAlias[mbo.target];
    };
    MuBinder.beforeIndexElement = function (ev) {
        if (ev.opts.bind) {
            var bindSrc = ev.opts.bind;
            for (var _i = 0, _a = MuBinder.parse(bindSrc, ev.element); _i < _a.length; _i++) {
                var mbo = _a[_i];
                MuBinder.setDefaults(mbo);
                if (!ev.widget.muBindOpts[mbo.source])
                    ev.widget.muBindOpts[mbo.source] = [];
                ev.widget.muBindOpts[mbo.source].push(mbo);
            }
        }
    };
    MuBinder.register = function (muWidget) {
        // @ts-ignore
        muWidget.PlugIns.push({
            beforeIndexElement: MuBinder.beforeIndexElement
        });
    };
    MuBinder.bindData = function (bindOpts, srcData, widget) {
        for (var k in srcData) {
            if (bindOpts[k]) {
                for (var _i = 0, _a = bindOpts[k]; _i < _a.length; _i++) {
                    var mbo = _a[_i];
                    if (mbo.forBind) {
                        var val = MuBinder.UseFilters(srcData[k], mbo.bindFilters, widget);
                        MuBinder.setValue(val, mbo.target, mbo.element, widget);
                    }
                }
            }
        }
    };
    MuBinder.fetchData = function (bindOpts, widget) {
        var resData = {};
        for (var k in bindOpts) {
            for (var _i = 0, _a = bindOpts[k]; _i < _a.length; _i++) {
                var mbo = _a[_i];
                if (mbo.forFetch) {
                    /* resData[k] = mbo.element[mbo.target];
                    let val = MuBinder.UseFilters(srcData[k], mbo.bindFilters, widget);
                    ; */
                    resData[k] = MuBinder.UseFilters(MuBinder.GetValue(mbo.target, mbo.element, widget), mbo.bindFilters, widget);
                }
            }
        }
        return resData;
    };
    MuBinder.UseFilters = function (val, filters, widget) {
        for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
            var filter = filters_1[_i];
            var obj = null;
            var fn = void 0;
            if (filter.methodName in widget)
                obj = widget; // fn = <MuBindFilterCallback>widget[filter.methodName];
            else if (widget.muParent && filter.methodName in widget.muParent)
                obj = widget.muParent; // fn = <MuBindFilterCallback>widget.muParent[filter.methodName];
            else if (filter.methodName in MuBinder.filters)
                obj = MuBinder.filters; //fn = MuBinder.filters[filter.methodName];
            fn = obj[filter.methodName];
            if (!fn)
                throw new Error("Unknown filter '" + filter.methodName + "'.");
            val = fn.call.apply(fn, __spreadArray([obj, val, {}], filter.args));
        }
        return val;
    };
    MuBinder.setValue = function (val, target, element, widget) {
        if (target === "@widget") {
            element["widget"].muBindData(val);
        }
        else if (target === "foreach" || target === "@foreach") {
            element.innerHTML = "";
            for (var k in widget.muTemplateParents) {
                if (element === widget.muTemplateParents[k]) {
                    var arr = [];
                    if (!Array.isArray(val)) {
                        for (var k_1 in val) {
                            arr.push({
                                key: k_1,
                                value: val[k_1]
                            });
                        }
                    }
                    else
                        arr = val;
                    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                        var data = arr_1[_i];
                        var widgetParams = {};
                        for (var k_2 in data) {
                            if (k_2.startsWith("."))
                                widgetParams[k_2.substr(1)] = data[k_2];
                        }
                        var itemWidget = widget.muWidgetFromTemplate(k, element, widgetParams);
                        itemWidget.muBindData(data);
                        if ("AferBind" in itemWidget) { // @ts-ignore
                            itemWidget.AferBind();
                        }
                    }
                    break;
                }
            }
        }
        else if (target.startsWith("."))
            this.setDeep(val, element["widget"], target.substr(1));
        else if (target.startsWith("@attr."))
            element.setAttribute(target.substr(6), val);
        else if (target == "@options") {
            var addOpt = function (val, text) {
                var opt = document.createElement("option");
                opt.text = text;
                opt.value = val;
                element.add(opt);
            };
            element.innerHTML = "";
            if (Array.isArray(val)) {
                for (var _a = 0, val_1 = val; _a < val_1.length; _a++) {
                    var item = val_1[_a];
                    if (typeof item === "string")
                        addOpt(item, item);
                    else
                        addOpt(item.value, item.text);
                }
            }
            else if (typeof val === "object") {
                for (var v in val) {
                    addOpt(v, val[v]);
                }
            }
        }
        else
            this.setDeep(val, element, target); // element[target] = val;
    };
    MuBinder.setDeep = function (value, object, path) {
        var obj = object;
        var fields = path.split(".");
        var lastI = fields.length - 1;
        var i = 0;
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var f = fields_1[_i];
            if (i < lastI)
                obj = obj[f];
            else
                obj[f] = value;
            i++;
        }
    };
    MuBinder.getDeep = function (object, path) {
        var obj = object;
        var fields = path.split(".");
        for (var _i = 0, fields_2 = fields; _i < fields_2.length; _i++) {
            var f = fields_2[_i];
            if (!(f in obj))
                return undefined;
            obj = obj[f];
        }
        return obj;
    };
    MuBinder.GetValue = function (target, element, widget) {
        switch (target) {
            case "@widget":
                return element["widget"].muFetchData();
            case "foreach":
            case "@foreach":
                return widget.muGetChildWidgets(element).map(function (itemWidget) { return itemWidget.muFetchData(); });
            default:
                if (target.startsWith("."))
                    return this.getDeep(element["widget"], target.substr(1));
                else if (target.startsWith("@attr."))
                    return element.getAttribute(target.substr(6));
                else
                    return this.getDeep(element, target); // element[target] = val;
                break;
            // return element[target];
        }
    };
    MuBinder.filters = {
        toLower: function (val) {
            return val === null || val === void 0 ? void 0 : val.toString().toLocaleLowerCase();
        },
        toUpper: function (val) { return val === null || val === void 0 ? void 0 : val.toString().toLocaleUpperCase(); },
        short: function (val, ev, maxLen, sufix) {
            if (sufix === void 0) { sufix = "..."; }
            var str = val.toString();
            if (str.length >= maxLen - sufix.length)
                str = str.substr(0, maxLen) + sufix;
            return str;
        },
        tern: function (val, ev, onTrue, onFalse) { return val ? onTrue : onFalse; },
        prepend: function (val, ev, prefix, ifAny) {
            if (ifAny === void 0) { ifAny = false; }
            return !ifAny || val ? prefix + val : val;
        },
        append: function (val, ev, prefix, ifAny) {
            if (ifAny === void 0) { ifAny = false; }
            return !ifAny || val ? val + prefix : val;
        },
    };
    return MuBinder;
}());
exports.MuBinder = MuBinder;
