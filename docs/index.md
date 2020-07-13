# The simple examples

```html
...
<div mu-widget="ClickCounter" mu-params='{"maxClickCount": 10}'>
	<button mu-id="btn">Click me</button>
	Clicked <span mu-id="clickCount"></span> times.
</div>
...
```

`mu-widget="ClickCounter"` define service class.  
`mu-params='{"maxClickCount": 10}'` define init property for service class.  
`mu-id="btn"` and `mu-id="clickCount"` define element id

```javascript
// class constructor
ClickCounter = function() 
{ 
	// init some properties
	this.clickCount = 0;
	this.maxClickCount = null;
};
// define methods
ClickCounter.prototype = {
	// this method is automaticaly binded for event click on element with id btn
	btn_click: function(sender)
	{
		// this refers to a service class instance
		// the element that triggered the event is passed as the first parameter of the method
		this.clickCount++;
		this.updateView();
		if (this.maxClickCount && this.clickCount >= this.maxClickCount)
		{
			// elements with mu-id atribute is accesible via property this.ui.(id)
			this.ui.btn.disabled = true;
		}
	},
	updateView: function()
	{
		this.ui.clickCount.innerText = this.clickCount;
	},
	// this method is called after indexing html and bindign events
	afterIndex: function()
	{
		this.updateView();
	}
}
window.onload = function()
{
	// index passed and nested html elements and init Widgets
	new MuWidget(document.getElementsByTagName('body')[0]);
}

```


# HTML element parameters

## `mu-id` 
Unique identifier in current widget scope.

After indexing, the html element will be available in the collection `this.ui` under its `mu-id`.

```html
<span mu-id="label"></label>
```

```javascript
this.ui.label.innerText = "Hello world";
```

## `mu-widget`
Widget service class. If you encounter this attribute when you index it, this will happen:

1. The specified class will be extended to the prototype MuWidget
2. Creates an instance of the specified class
3. The property is set
4. The afterIndex method is called

## `mu-noindex`
Do not index this and nested elements.

## `mu-nocontent`
Do not index nested elements. 

## `mu-params`
Parameters passed to the service class in JSON format

MuWidget constructor parameters
==
|||
|-|-|
| `container` 	| HTMLElement containing Widgets
| `opts` 		| Options

MuWidget options
--

|Field|What is it for|Default value|
|-|-|-|
| `attributePrefix` | Prefix for HTML element parameters | `'mu-'`
| `bindEvents` 	| List of events to bind | `['click', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'blur', 'change', 'focus', 'select', 'submit', 'keyup', 'keydown', 'scroll']`
| `autoMethodNameSeparator` 	| id / event separator for autobinded methods | `'_'`

Indexing html elements
==

