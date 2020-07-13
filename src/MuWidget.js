/*	This file is part of MuWidget.

	MuWidget is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	MuWidget is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with MuWidget.  If not, see <https://www.gnu.org/licenses/>. */

var autostart = MuWidget && MuWidget.autostart;

var MuWidget = function(container, opts)
{
	this.muInit(container, opts);
}

MuWidget.extendPrototype = function(prototype)
{
	for(var k in MuWidget.prototype) prototype[k] = MuWidget.prototype[k];
}

MuWidget.prototype = {
	muInit: function(container, opts)
	{
		this.ui = {};
		this.muOpts = this.muMergeObjects(
			{
				attributePrefix: "mu-",
				bindEvents: ['click', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'blur', 'change', 'focus', 'select', 'submit', 'keyup', 'keydown', 'keypress', 'scroll'],
				autoMethodNameSeparator: "_"
			},
			opts ? opts : {}
		);
		this.container = container;
		this.container.widget = this;
		this.muSubWidgets = [];
		this.muNamedWidget = {};
		this.muTemplates = [];
		this.muRoot = null;

		if (this['beforeIndex']) this.beforeIndex();
		this.muAddEvents({ id: 'container' }, this.container);
		this.muIndexTree(container, true);
	},

	muIndexTree: function(element, indexWidget, useName)
	{
		var ev = { element: element, widget: this };
		this.muCallPlugin("indexPrepareElement", ev);
		if (!ev.element) return;
		element = ev.element;

		var opts = ev.opts || this.muGetElementOpts(element);
		this.muIndexOpts = opts;
		useName = useName || opts.usename;
		if (useName && element.attributes["name"]) opts.id = element.attributes["name"];
		if (opts.noindex) return;
		if (opts.template) 
		{
			element.removeAttribute(this.muOpts.attributePrefix + "template");
			this.muTemplates[opts.template] = element.outerHTML;
			element.parentNode.removeChild(element);
			return;
		}
		if (opts.id) this.muAddUi(opts.id, element);
		this.muAddEvents(opts, element);
		if ((!opts.widget || indexWidget) && !opts.nocontent && element.children) 
		{
			// Index children
			var elements = [];
			// Create copy, template modify children
			for(var i = 0, l = element.children.length; i < l; i++) elements.push(element.children[i]);
			
			for(var i = 0, l = elements.length; i < l; i++)
			{
				// if (elements[i])
				this.muIndexTree(elements[i], false, useName);
			}
		}
		if (opts.widget && !indexWidget)
		{
			// Initialize widget
			this.muActivateWidget(element, opts);
		}
		if (indexWidget && this['afterIndex']) this.afterIndex();
	},

	muIndexForm: function(form)
	{
		if (!form)
		{
			if (this.container.tagName == 'FORM') form = this.container;
			else form = this.container.querySelector('form');
		}
		if (form)
		{
			this.muAddUi('form', form);
			this.muAddEvents({ id: 'form' }, form);
			for(var i = 0, l = form.elements.length; i < l; i++)
			{
				var element = form.elements[i];
				this.muAddUi(element.name, element);
				this.muAddEvents({ id: element.name }, element);
			}
		}
	},

	muIndexByName: function(form)
	{
		if (!form)
		{
			if (this.container.tagName == 'FORM') form = this.container;
			else form = this.container.querySelector('form');
		}
		if (form)
		{
			this.muAddUi('form', form);
			this.muAddEvents({ id: 'form' }, form);
			for(var i = 0, l = form.elements.length; i < l; i++)
			{
				var element = form.elements[i];
				this.muAddUi(element.name, element);
				this.muAddEvents({ id: element.name }, element);
			}
		}
	},

	muActivateWidget: function(element, opts, extraParams)
	{
		if (opts === undefined) opts = this.muGetElementOpts(element);
		if (!window[opts.widget]) throw "Class '" + opts.widget + "' is not defined.";
		var widget = new window[opts.widget](element, opts, this);
		widget.muParent = this;
		widget.muRoot = this.muRoot || this;
		if (opts.params)
		{
			var params = JSON.parse(opts.params);
			for(var k in params)
			{
				widget[k] = params[k];
			}
		}
		if (extraParams)
		{
			for(var k in extraParams)
			{
				widget[k] = extraParams[k];
			}
		}
		MuWidget.extendPrototype(widget);
		this.muSubWidgets.push(widget);
		if (opts.id) this.muNamedWidget[opts.id] = widget;
		MuWidget.call(widget, element, opts.opts || this.muOpts);

		return widget;
	},

	muGetRoot: function()
	{
		return this.muParent ? this.muParent.muGetRoot() : this;
		// return MuWidget.root; // this.muParent || this;
	},

	muWidgetFromTemplate: function(templateName, container, params, addMethod)
	{
		if (!addMethod) addMethod = 'appendChild';
		if (typeof container == 'string') container = this.ui[container];
		
		var tmpElemementType = "div";
		var tmpTemplate = this.muTemplates[templateName].toLowerCase();
		if (tmpTemplate.startsWith('<tr')) tmpElemementType = "tbody";
		if (tmpTemplate.startsWith('<tbody')) tmpElemementType = "table";
		var element = document.createElement(tmpElemementType);
		element.innerHTML = this.muTemplates[templateName];
		element = element.firstChild; 
		// if (params) element.setAttribute('mu-params', JSON.stringify(params));
		
		if (container) container[addMethod](element);

		return this.muActivateWidget(element, undefined, params);
	},

	muGetElementOpts: function(element)
	{
		var res = {};
		for (var i = 0, attributes = element.attributes, n = attributes.length, arr = []; i < n; i++)
		{
			var name = attributes[i].nodeName;
			if (name.startsWith(this.muOpts.attributePrefix))
			{
				var optName = name.substr(this.muOpts.attributePrefix.length);
				res[optName] = attributes[i].nodeValue;
			}
		}
		return res;
	},

	muMergeObjects: function()
	{
		var res = {};
		for (var i = 0; i < arguments.length; i++) {
			for (var k in arguments[i])
			{
				res[k] = arguments[i][k];
			}
		}
		return res;
	},

	muGetMethodCallback: function(name, context)
	{
		var self = context || this;
		var params = [];
		var p = null;
		if (-1 != (p = name.indexOf(':')))
		{
			params = JSON.parse('[' + name.substr(p + 1) + ']');
			name = name.substr(0, p);
		}
		var method = this[name];
		if (method === undefined) throw "Undefined method '" + name + "' in class '" + this.constructor.name + "'.";
		return function()
		{
			var callparams = [];
			for(var i = 0, l = params.length; i < l; i++) callparams.push(params[i]);
			for(var i = 0, l = arguments.length; i < l; i++) callparams.push(arguments[i]);
			// for(var item of params) callparams.push(item);
			// for(var item of arguments) callparams.push(item);
			return method.apply(self, callparams);
		};
	},

	muAddUi: function(name, element)
	{
		this.ui[name] = element;
	},

	muAddEvents: function(opts, element)
	{
		var tags = opts.tag ? opts.tag.split(" ") : null;
		var autoMethodName, i, l;

		for(i = 0, l = this.muOpts.bindEvents.length; i < l; i++)
		{
			var eventName = this.muOpts.bindEvents[i];
			var methodName = opts[eventName];
			if (methodName === undefined)
			{
				if (opts.id)
				{
					autoMethodName = opts.id + this.muOpts.autoMethodNameSeparator + eventName;
					if (this[autoMethodName] !== undefined) methodName = autoMethodName;
				}
			} 
			if (methodName)
			{
				this.muAddEvent(eventName, element, this.muGetMethodCallback(methodName));
			}
			if (tags)
			{
				for(var i1 = 0, l1 = tags.length; i1 < l1; i1++)
				{
					autoMethodName = tags[i1] + this.muOpts.autoMethodNameSeparator + eventName;
					if (this[autoMethodName] !== undefined)
					{
						this.muAddEvent(eventName, element, this.muGetMethodCallback(autoMethodName));
					}					
				}
			}
		}
		// init
		if (tags)
		{
			for(i = 0, l = tags.length; i < l; i++)
			{
				autoMethodName = tags[i] + this.muOpts.autoMethodNameSeparator + "init";
				if (this[autoMethodName] !== undefined)
				{
					this.muGetMethodCallback(autoMethodName)(element);
				}					
			}
		}
},

	muAddEvent: function(eventName, element, callback)
	{
		element.addEventListener(eventName, function() {
			callback(this);
		});
	},

	muGetId: function(element)
	{
		return this.muGetElementOpts(element).id;
		// this.muIndexOpts
	},

	muVisible: function(state, control)
	{
		if (Array.isArray(control))
		{
			for(var i = 0, l = control.length; i < l; i++) this.muVisible(state, control[i]);
		}
		else
		{
			if (typeof control === 'string') control = this.ui[control];
			control.style.display = state ? null : "none";
		}
	},

	muCallPlugin: function(eventName, eventArgs)
	{
		for(var i = 0, l = MuWidgetPlugIns.length; i < l; i++)
		{
			var plugin = MuWidgetPlugIns[i];
			if (plugin[eventName]) plugin[eventName](eventArgs);
		}
	}
}

MuWidget.startup = function(startElement, onSucces, onBefore)
{
	var fn = window.addEventListener || window.attachEvent || function(type, listener)
	{
		if (window.onload) {
			var curronload = window.onload;
			var newonload = function(evt) {
				curronload(evt);
				listener(evt);
			};
			window.onload = newonload;
		} else {
			window.onload = listener;
		}
	};
	fn('load', function() {
		if (onBefore) onBefore();
		var element = startElement || document.documentElement;
		var muRoot = new MuWidget(element);
		MuWidget.root = muRoot;
		if (onSucces) onSucces(muRoot);
	});
}

MuWidget.getWidget = function(currentElement)
{
	var el = currentElement;
	while(el)
	{
		if (el.widget) return el.widget;
		el = el.parentNode;
	}
}

MuWidget.getChildWidgets = function(list, fn)
{
	var ls = [];
	for(var i = 0; i < list.children.length; i++)
	{
		var item = list.children[i].widget; // MuWidget.getWidget(list.children[i]);
		if (!item) continue;
		if (fn) item = fn(item);
		ls.push(item);
	};
	return ls;
}

if (typeof MuWidget_autostart != "undefined" ? MuWidget_autostart : false) MuWidget.startup();

/* function htmlFromString(htmlString) {
	var div = document.createElement('div');
	div.innerHTML = htmlString.trim();
	return div.firstChild; 
} */

