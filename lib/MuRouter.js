"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuRouter = void 0;
class MuRouter {
    constructor() {
        this.routes = {};
        this.persistentKeys = [];
        this.persistentValues = {};
        this.pathPrefix = "";
        this.lastParameters = {};
        window.onpopstate = ev => this.route(document.location);
    }
    addRoute(name, re, callback) {
        const route = {
            callback: callback,
            name: name,
            reText: re,
        };
        MuRouter.compileRe(route);
        this.routes[name] = route;
        return this;
    }
    static compileRe(route) {
        const defaultReChunk = "[^/?#]*";
        let p = 0;
        let lastP = 0;
        let re = "";
        let s;
        const rete = route.reText;
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
            let chunk = rete.substring(lastP, p);
            const p1 = chunk.indexOf(" ");
            let reChunk;
            let name;
            if (p1 >= 0) {
                reChunk = chunk.substr(p1 + 1);
                name = chunk.substr(0, p1);
            }
            else {
                reChunk = defaultReChunk;
                name = chunk;
            }
            route.chunks.push({ name: name });
            re += "(" + reChunk + ")";
            route.paramNames.push(name);
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
    }
    route(location = null) {
        if (!location)
            location = window.location;
        if (this.pathPrefix) {
            if (typeof location != "string") {
                location = location.pathname + location.search;
            }
            location = location.substr(this.pathPrefix.length);
        }
        if (typeof location == "string") {
            let p = location.indexOf("?");
            location = {
                pathname: p >= 0 ? location.substr(0, p) : location,
                search: p >= 0 ? location.substr(p) : ""
            };
        }
        for (let routeName in this.routes) {
            const route = this.routes[routeName];
            const m = route.re.exec(location.pathname);
            if (!m)
                continue;
            const res = this.parseQueryString(location.search);
            for (let i = 0; i < m.length; i++) {
                if (i > 0) {
                    res[route.paramNames[i - 1]] = decodeURIComponent(m[i]);
                }
            }
            this.updatePersistent(res);
            route.callback({ parameters: res, routeName });
            break;
            // console.log(m);
        }
    }
    makeUrl(name, currParams) {
        let url = "";
        let used = [];
        const params = Object.assign({}, this.persistentValues);
        for (const k in currParams)
            if (currParams[k] !== null)
                params[k] = currParams[k];
        if (!(name in this.routes))
            throw new Error("No route '" + name + "'");
        let route = this.routes[name];
        for (const chunk of route.chunks) {
            if (typeof chunk == "string") {
                url += chunk;
            }
            else {
                url += chunk.name in params ? encodeURIComponent(params[chunk.name]) : "";
                used.push(chunk.name);
            }
        }
        const q = Object.keys(params).filter(k => used.indexOf(k) < 0).sort().map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])).join("&");
        if (q)
            url += "?" + q;
        return this.pathPrefix + url;
    }
    push(name, params = {}) {
        this.updatePersistent(params);
        history.pushState({}, null, this.makeUrl(name, params));
    }
    replace(name, params = {}) {
        this.updatePersistent(params);
        history.replaceState({}, null, this.makeUrl(name, params));
    }
    update(name, params = {}) {
        this.updatePersistent(params, true);
        history.replaceState({}, null, this.makeUrl(name, Object.assign(Object.assign({}, this.lastParameters), params)));
    }
    navigate(name, params = {}) {
        this.push(name, params);
        this.routes[name].callback({ parameters: params, routeName: name });
    }
    parseQueryString(queryString) {
        var res = {};
        if (queryString.startsWith("?"))
            queryString = queryString.substr(1);
        for (let item of queryString.split("&")) {
            if (!item)
                continue;
            const p = item.indexOf("=");
            let k;
            let v;
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
    }
    updatePersistent(res, patch = false) {
        for (let k of this.persistentKeys) {
            if (k in res) {
                const v = res[k];
                if (v !== null)
                    this.persistentValues[k] = v;
                else
                    delete this.persistentValues[k];
            }
        }
        if (patch) {
            for (let k in res) {
                const v = res[k];
                if (v !== null)
                    this.lastParameters[k] = v;
                else
                    delete this.lastParameters[k];
            }
        }
        else
            this.lastParameters = res;
    }
    getParameters() {
        return this.lastParameters;
    }
}
exports.MuRouter = MuRouter;
