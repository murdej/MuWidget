import { MuWidget } from "./MuWidget";
import { MuBinder, MuBindOpts} from "./MuBinder";

export class IMuWidget // extends MuWidget
{
	public ui : Record<string, AnyElement|any> = {};

	public muWidgetFromTemplate(templateName : string, container : string|AnyElement, params : Record<string, any>|((MuWidget)=>Record<string, any>) = null, addMethod : string = "appendChild") : IMuWidget { return null; };

	public muRemoveSelf() : void {};

	public container : HTMLElement;

	public muGetChildWidgets<T>(container : string|AnyElement) : T[]
	{
		if (typeof container === "string") container = this.ui[container];
		return MuWidget.getChildWidgets(container);
	}

	public muBindList(list: any[], templateName : string, container : string|AnyElement, commonParams : any = null, finalCalback : (widget : any) => void = null) { }

	public muVisible(state : boolean, control : string|string[]) { }

	public muSubWidgets : IMuWidget[];

	public muNamedWidget : Record<string, IMuWidget>;

	public muRoot : IMuWidget;
	
	public muParent : IMuWidget|null;

	public muTemplates : Record<string, string>;

	public muTemplateParents : Record<string, AnyElement>;

	public muAddEvent(eventName : string, element : AnyElement, callback : any) : void {}

	public muOnAfterIndex : ((self) => void)[];

	public muBindOpts : Record<string, MuBindOpts[]> = {};

	public muBindData(srcData : any)
	{
		MuBinder.bindData(this.muBindOpts, srcData, this);
		this.muAferBindData();
	}

	public muFetchData() : any
	{
		return MuBinder.fetchData(this.muBindOpts, this);
	}

	public muDispatchEvent(name: string, ...args) { }

	protected muRegisterEvent(...args) { }

	public addEventListener(name : string, handler : (...args)=>void) { }

	public muEventNames() : string[] { return []; }

	protected muAferBindData() { }
}

export type AnyElement = HTMLElement|SVGElement;

export function SetAttributes(element : AnyElement, attrs : Record<string,any>)
{
	for(const n in attrs)
	{
		element.setAttribute(n, attrs[n].toString());
	}
}