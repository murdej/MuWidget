MuWidget = function(container, opts)
{
	this.muInit(container, opts);
}

MuWidget.extendPrototype = function(prototype)
{
	for(k in MuWidget.prototype) prototype[k] = MuWidget.prototype[k];
}

MuWidget.prototype = {
	muInit: function(container, opts)
	{
		this.ui = {};
		this.muOpts = this.muMergeObjects(
			{
				attributePrefix: "mu-",
				bindEvents: ['click', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'blur', 'change', 'focus', 'select', 'submit', 'keyup', 'keydown', 'scroll'],
				autoMethodNameSeparator: "_"
			},
			opts ? opts : {}
		);
		this.container = container;
		this.container.widget = this;
		this.muSubWidgets = [];
		this.muTemplates = [];

		this.muIndexTree(container, true);
	},

	muIndexTree: function(element, indexWidget)
	{
		var opts = this.muGetElementOpts(element);
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
		if ((!opts.widget || indexWidget) && !opts.nocontent) 
		{
			// Index children
			var elements = element.children;
			for(var i = 0, l = elements.length; i < l; i++)
			{
				this.muIndexTree(elements[i]);
			}
		}
		if (opts.widget && !indexWidget)
		{
			// Initialize widget
			this.muActivateWidget(element, opts);
		}
		if (indexWidget && this['afterIndex']) this.afterIndex();
	},

	muActivateWidget: function(element, opts)
	{
		if (opts === undefined) opts = this.muGetElementOpts(element);
		var widget = new window[opts.widget](element, opts, this);
		if (opts.params)
		{
			var params = JSON.parse(opts.params);
			for(var k in params)
			{
				widget[k] = params[k];
			}
		}
		widget.muParent = this;
		MuWidget.extendPrototype(widget);
		this.muSubWidgets.push(widget);
		MuWidget.call(widget, element, opts.opts || this.muOpts);

		return widget;
	},

	muWidgetFromTemplate: function(templateName, container)
	{
		if (typeof container == 'string') container = this.ui[container];
		
		var element = document.createElement('div');
		element.innerHTML = this.muTemplates[templateName];
		element = element.firstChild; 
		
		if (container) container.appendChild(element);

		return this.muActivateWidget(element);
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
		var method = this[name];
		return function()
		{
			return method.apply(self, arguments);
		};
	},

	muAddUi: function(name, element)
	{
		this.ui[name] = element;
	},

	muAddEvents: function(opts, element)
	{
		for(var i = 0, l = this.muOpts.bindEvents.length; i < l; i++)
		{
			var eventName = this.muOpts.bindEvents[i];
			var methodName = opts[eventName];
			if (methodName === undefined && opts.id)
			{
				var autoMethodName = opts.id + this.muOpts.autoMethodNameSeparator + eventName;
				if (this[autoMethodName] !== undefined) methodName = autoMethodName;
			}
			if (methodName)
			{
				this.muAddEvent(eventName, element, this.muGetMethodCallback(methodName));
			}
		}
	},

	muAddEvent: function(eventName, element, callback)
	{
		element.addEventListener(eventName, function() {
			callback(this);
		});
	}
}

function htmlFromString(htmlString) {
	var div = document.createElement('div');
	div.innerHTML = htmlString.trim();
	return div.firstChild; 
}