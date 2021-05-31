import {AnyElement, IMuWidget} from "./IMuWidget";
import {StrParser, StrParserMark} from "./StrParser";

export class MuBinder
{
	public static parse(src : string, element : AnyElement) : MuBindOpts[]
	{
		/*
		source
		source:target
		source::target
		source;target
		sourcer|filter():target
		*/
		let mode : "source"|"target"|"bindFilter"|"fetchFilter"|"complete"|"end";
		const optsList : MuBindOpts[] = [];
		const sp = new StrParser(src);
		let p: StrParserMark;
		let lastP: number = 0;

		function parseFetchBind(chunk: string, opts : MuBindOpts): boolean {
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

		function parseFilter(sp: StrParser, bindPart: boolean, opts : MuBindOpts): MuBindFilter {
			p = sp.findNext(["::", ":", "|", "^", ";", "("]);
			let filter: MuBindFilter = {
				methodName: sp.substring(lastP, p).trim(),
				args: []
			};
			if (!p) {
				mode = "end";
			} else if (p.chunk === ";") {
				mode = "complete";
				sp.toEndChunk();
			} else {
				sp.toEndChunk();
				lastP = sp.position;
				if (p.chunk === "(") {
					const argStart = sp.pos();
					while (true) {
						p = sp.findNext([")", "\""]);
						if (p === null) throw "missing ')' after argument(s) '" + src + "'";
						if (p.chunk == ")") {
							sp.toEndChunk();
							lastP = sp.position;
							break;
						}
						// skoč na konec stringu
						sp.toEndChunk();
						do {
							p = sp.findNext(["\\\"", "\""]);
							if (p === null) throw "unterminated string '" + src + "'";
							sp.toEndChunk();
						}
						while (p.chunk === "\\\"")
					}
					const sArgs = sp.substring(argStart, p);
					try {
						filter.args = JSON.parse("[" + sArgs + "]");
					} catch (exc) {
						throw "Invalid arguments - " + exc.toString() + " '" + sArgs + "'";
					}
				}
				mode = parseFetchBind(p.chunk, opts) ? "target" : (bindPart ? "bindFilter" : "fetchFilter");
				// sp.toEndChunk();
				lastP = sp.position;
			}
			return filter.methodName ? filter : null;
		}

		while(!sp.isEnd() && mode != "end") {
			mode = "source";
			const opts: MuBindOpts = {
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
						} else if (p.chunk == ";") {
							mode = "complete"
						} else {
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
						} else if (p.chunk == ";") {
							mode = "complete"
						} else {
							mode = "fetchFilter";
							sp.toEndChunk();
							lastP = sp.position;
						}
						break;
					case "bindFilter":
						var f = parseFilter(sp, true, opts);
						if (f) opts.bindFilters.push(f);
						break;
					case "fetchFilter":
						f = parseFilter(sp, false, opts);
						if (f) opts.fetchFilters.push(f);
						break;
				}
			}
			optsList.push(opts);
			sp.toEndChunk();
			lastP = sp.position;
		}

		return optsList;
	}

	static setDefaults(mbo: MuBindOpts)
	{
		const defaults : any = {};
		// mbo.element.hasAttribute("mu-widget")
		if (mbo.element.hasAttribute("mu-widget"))
		{
			defaults.forBind = true;
			defaults.forFetch = true;
			defaults.target = "@widget";
		}
		else if (mbo.element instanceof HTMLInputElement || mbo.element instanceof HTMLTextAreaElement || mbo.element instanceof HTMLSelectElement)
		{
			if (mbo.element.type === "file")
			{
				defaults.forBind = false;
				defaults.forFetch = true;
				defaults.target = "files";
			}
			else
			{
				defaults.forBind = true;
				defaults.forFetch = true;
				if (mbo.element.type === "checkbox")
					defaults.target = "checked";
				else
					defaults.target = "value";
			}
		}
		else
		{
			defaults.forBind = true;
			defaults.forFetch = false;
			defaults.target = "text";
		}
		for(const k in defaults)
		{
			if (mbo[k] === null) mbo[k] = defaults[k];
		}
		const targetAlias = {
			text: "innerText",
			html: "innerHTML"
		}
		if (targetAlias[mbo.target]) mbo.target = targetAlias[mbo.target];
	}

	public static beforeIndexElement(ev : { opts : any, element : AnyElement, widget : IMuWidget})
	{
		if (ev.opts.bind)
		{
			const bindSrc : string = ev.opts.bind;
			for(var mbo of MuBinder.parse(bindSrc, ev.element))
			{
				MuBinder.setDefaults(mbo);
				if (!ev.widget.muBindOpts[mbo.source]) ev.widget.muBindOpts[mbo.source] = [];
				ev.widget.muBindOpts[mbo.source].push(mbo);
			}
		}
	}

	public static register(muWidget)
	{
		// @ts-ignore
		muWidget.PlugIns.push({
			beforeIndexElement: MuBinder.beforeIndexElement
		});
	}

	public static bindData(bindOpts: Record<string, MuBindOpts[]>, srcData : any, widget : IMuWidget)
	{
		for(const k in srcData)
		{
			if (bindOpts[k])
			{
				for(const mbo of bindOpts[k])
				{
					if (mbo.forBind)
					{
						let val = MuBinder.UseFilters(srcData[k], mbo.bindFilters, widget);
						MuBinder.setValue(val, mbo.target, mbo.element, widget);
					}
				}
			}
		}
	}

	static fetchData(bindOpts: Record<string, MuBindOpts[]>, widget : IMuWidget) : any {
		const resData = {};
		for(const k in bindOpts)
		{
			for(const mbo of bindOpts[k])
			{
				if (mbo.forFetch)
				{
					/* resData[k] = mbo.element[mbo.target];
					let val = MuBinder.UseFilters(srcData[k], mbo.bindFilters, widget);
					; */

					resData[k] = MuBinder.UseFilters(MuBinder.GetValue(mbo.target, mbo.element, widget), mbo.bindFilters, widget);
				}
			}
		}
		return resData;
	}

	private static UseFilters(val: any, filters : MuBindFilter[], widget : IMuWidget) : any
	{
		for	(const filter of filters)
		{
			let obj = null;
			let fn : MuBindFilterCallback;
			if (filter.methodName in widget) obj = widget; // fn = <MuBindFilterCallback>widget[filter.methodName];
			else if (widget.muParent && filter.methodName in widget.muParent) obj = widget.muParent; // fn = <MuBindFilterCallback>widget.muParent[filter.methodName];
			else if (filter.methodName in MuBinder.filters) obj = MuBinder.filters; //fn = MuBinder.filters[filter.methodName];
			fn = obj[filter.methodName];
			if (!fn) throw new Error("Unknown filter '" + filter.methodName + "'.");
			val = fn.call(obj, val, <MuBindFilterEv>{}, ...filter.args);
		}
		return val;
	}

	private static setValue(val: any, target : string, element : AnyElement, widget : IMuWidget)
	{
		if (target === "@widget")
		{
			(element["widget"] as IMuWidget).muBindData(val);
		}
		else if (target === "foreach") {
			element.innerHTML = "";
			for (const k in widget.muTemplateParents) {
				if (element === widget.muTemplateParents[k]) {
					let arr : any[] = [];
					if (!Array.isArray(val))
					{
						for(const k in val)
						{
							arr.push({
								key: k,
								value: val[k]
							});
						}
					} else arr = val;
					for (const data of arr) {
						const widgetParams = {};
						for (const k in data) {
							if (k.startsWith(".")) widgetParams[k.substr(1)] = data[k];
						}
						const itemWidget: IMuWidget = widget.muWidgetFromTemplate(k, element, widgetParams);
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
		else if (target == "@options")
		{
			const addOpt = function(val, text) {
				const opt = document.createElement("option");
				opt.text = text;
				opt.value = val;
				(element as HTMLSelectElement).add(opt);
			};
			element.innerHTML = "";
			if (Array.isArray(val))
			{
				for(const item of val)
				{
					if (typeof item === "string") addOpt(item, item);
					else addOpt(item.value, item.text);
				}
			}
			else if (typeof val === "object")
			{
				for(const v in val)
				{
					addOpt(v, val[v]);
				}
			}
		}
		else
			this.setDeep(val, element, target); // element[target] = val;
	}

	public static setDeep(value, object, path : string)
	{
		let obj = object;
		const fields = path.split(".");
		const lastI = fields.length - 1;
		let i = 0;
		for(const f of fields)
		{
			if (i < lastI) obj = obj[f];
			else obj[f] = value;
			i++;
		}
	}

	public static getDeep(object, path : string) : any
	{
		let obj = object;
		const fields = path.split(".");
		for(const f of fields)
		{
			if (!(f in obj)) return undefined;
			obj = obj[f];
		}
		return obj;
	}

	private static GetValue(target : string, element : AnyElement, widget : IMuWidget) : any
	{
		switch (target)
		{
			case "@widget":
				return (element["widget"] as IMuWidget).muFetchData();
			case "foreach": //todo:
				return widget.muGetChildWidgets<IMuWidget>(element).map(itemWidget => itemWidget.muFetchData());
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
	}

	public static filters : Record<string, MuBindFilterCallback> = {
		toLower: val => {
			return val?.toString().toLocaleLowerCase();
		},
		toUpper: val => val?.toString().toLocaleUpperCase(),
		short: (val, ev, maxLen : number, sufix = "...") => {
			let str = val.toString();
			if (str.length >= maxLen - sufix.length) str = str.substr(0, maxLen) + sufix;
			return str;
		},
		tern: (val, ev, onTrue, onFalse) => val ? onTrue : onFalse,
		prepend: (val, ev, prefix : string, ifAny: boolean = false) =>
			!ifAny || val ? prefix + val : val,
		append: (val, ev, prefix : string, ifAny: boolean = false) =>
			!ifAny || val ? val + prefix : val,
	}
}

export type MuBindFilterCallback = (val : any, ev? : MuBindFilterEv, ...args) => any;

export type MuBindOpts = {
	forBind: boolean,
	forFetch: boolean,
	source: string,
	target: string|null,
	bindFilters : MuBindFilter[],
	fetchFilters : MuBindFilter[],
	element : AnyElement,
}

export type MuBindFilter = {
	methodName : string,
	args : any[]
}

export type MuBindFilterEv = {

}