"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuRouter = void 0;
var MuRouter = /** @class */ (function () {
    function MuRouter() {
        var _this = this;
        this.routes = {};
        this.persistentKeys = [];
        this.persistentValues = {};
        this.pathPrefix = "";
        this.lastParameters = {};
        window.onpopstate = function (ev) { return _this.route(document.location); };
    }
    MuRouter.prototype.addRoute = function (name, re, callback) {
        var route = {
            callback: callback,
            name: name,
            reText: re,
        };
        MuRouter.compileRe(route);
        this.routes[name] = route;
        return this;
    };
    MuRouter.compileRe = function (route) {
        var defaultReChunk = "[^/?#]*";
        var p = 0;
        var lastP = 0;
        var re = "";
        var s;
        var rete = route.reText;
        route.chunks = [];
        route.paramNames = [];
        while (true) {
            p = rete.indexOf("<", lastP);
            if (p < 0) {
                s = rete.substr(lastP);
                if (s) {
                    route.chunks.push(s);
                    re += s;
                }
                break;
            }
            else {
                s = rete.substring(lastP, p);
                if (s) {
                    route.chunks.push(s);
                    re += s;
                }
            }
            lastP = p + 1;
            p = rete.indexOf(">", lastP);
            if (p < 0) {
                throw new Error("Missing parametr end");
            }
            var chunk = rete.substring(lastP, p);
            var p1 = chunk.indexOf(" ");
            var reChunk = void 0;
            var name_1 = void 0;
            if (p1 >= 0) {
                reChunk = chunk.substr(p1 + 1);
                name_1 = chunk.substr(0, p1);
            }
            else {
                reChunk = defaultReChunk;
                name_1 = chunk;
            }
            route.chunks.push({ name: name_1 });
            re += "(" + reChunk + ")";
            route.paramNames.push(name_1);
            lastP = p + 1;
        }
        /* const re = route.reText.replace(/<[^>]+>/, (chunk) => {
            const p = chunk.indexOf(" ");
            let reChunk;
            let name;
            if (p >= 0)
            {
                reChunk = chunk.substr(p + 1);
                name = chunk.substr(0, p);
            }
            else
            {
                reChunk = defaultReChunk;
                name = chunk;
            }
            route.chunkNames.push(name);
            return reChunk;
        }); */
        route.re = new RegExp(re);
    };
    MuRouter.prototype.route = function (location) {
        if (location === void 0) { location = null; }
        if (!location)
            location = window.location;
        if (this.pathPrefix) {
            if (typeof location != "string") {
                location = location.pathname + location.search;
            }
            location = location.substr(this.pathPrefix.length);
        }
        if (typeof location == "string") {
            var p = location.indexOf("?");
            location = {
                pathname: p >= 0 ? location.substr(0, p) : location,
                search: p >= 0 ? location.substr(p) : ""
            };
        }
        for (var routeName in this.routes) {
            var route = this.routes[routeName];
            var m = route.re.exec(location.pathname);
            if (!m)
                continue;
            var res = this.parseQueryString(location.search);
            for (var i = 0; i < m.length; i++) {
                if (i > 0) {
                    res[route.paramNames[i - 1]] = decodeURIComponent(m[i]);
                }
            }
            this.updatePersistent(res);
            route.callback({ parameters: res, routeName: routeName });
            break;
            // console.log(m);
        }
    };
    MuRouter.prototype.makeUrl = function (name, currParams) {
        var url = "";
        var used = [];
        var params = __assign({}, this.persistentValues);
        for (var k in currParams)
            if (currParams[k] !== null)
                params[k] = currParams[k];
        if (!(name in this.routes))
            throw new Error("No route '" + name + "'");
        var route = this.routes[name];
        for (var _i = 0, _a = route.chunks; _i < _a.length; _i++) {
            var chunk = _a[_i];
            if (typeof chunk == "string") {
                url += chunk;
            }
            else {
                url += chunk.name in params ? encodeURIComponent(params[chunk.name]) : "";
                used.push(chunk.name);
            }
        }
        var q = Object.keys(params).filter(function (k) { return used.indexOf(k) < 0; }).sort().map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]); }).join("&");
        if (q)
            url += "?" + q;
        return this.pathPrefix + url;
    };
    MuRouter.prototype.push = function (name, params) {
        if (params === void 0) { params = {}; }
        this.updatePersistent(params);
        history.pushState({}, null, this.makeUrl(name, params));
    };
    MuRouter.prototype.replace = function (name, params) {
        if (params === void 0) { params = {}; }
        this.updatePersistent(params);
        history.replaceState({}, null, this.makeUrl(name, params));
    };
    MuRouter.prototype.update = function (name, params) {
        if (params === void 0) { params = {}; }
        this.updatePersistent(params, true);
        history.replaceState({}, null, this.makeUrl(name, __assign(__assign({}, this.lastParameters), params)));
    };
    MuRouter.prototype.navigate = function (name, params) {
        if (params === void 0) { params = {}; }
        this.push(name, params);
        this.routes[name].callback({ parameters: params, routeName: name });
    };
    MuRouter.prototype.parseQueryString = function (queryString) {
        var res = {};
        if (queryString.startsWith("?"))
            queryString = queryString.substr(1);
        for (var _i = 0, _a = queryString.split("&"); _i < _a.length; _i++) {
            var item = _a[_i];
            if (!item)
                continue;
            var p = item.indexOf("=");
            var k = void 0;
            var v = void 0;
            if (p >= 0) {
                k = decodeURIComponent(item.substr(0, p));
                v = decodeURIComponent(item.substr(p + 1));
            }
            else {
                k = decodeURIComponent(item);
                v = true;
            }
            res[k] = v;
        }
        return res;
    };
    MuRouter.prototype.updatePersistent = function (res, patch) {
        if (patch === void 0) { patch = false; }
        for (var _i = 0, _a = this.persistentKeys; _i < _a.length; _i++) {
            var k = _a[_i];
            if (k in res) {
                var v = res[k];
                if (v !== null)
                    this.persistentValues[k] = v;
                else
                    delete this.persistentValues[k];
            }
        }
        if (patch) {
            for (var k in res) {
                var v = res[k];
                if (v !== null)
                    this.lastParameters[k] = v;
                else
                    delete this.lastParameters[k];
            }
        }
        else
            this.lastParameters = res;
    };
    MuRouter.prototype.getParameters = function () {
        return this.lastParameters;
    };
    return MuRouter;
}());
exports.MuRouter = MuRouter;
