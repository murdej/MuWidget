import { IMuWidget } from "./IMuWidget";

export class UiFlashMessage extends IMuWidget
{
	public afterIndex()
	{
		this.updateVisibility();
	}

	public updateVisibility() 
	{
		this.container.style.display = this.ui.items.firstElementChild
			? null
			: "none";
	}

	public add(text : string) : UiLoaderItem
	{
		var item = this.muWidgetFromTemplate("item", "items", { text: text }) as UiLoaderItem;
		this.updateVisibility();
		return item;
	}
}

export class UiLoaderItem extends IMuWidget
{
	public text : string;

	public afterIndex()
	{
		this.ui.text.innerText = this.text;
	}

	public remove() : void
	{
		this.muRemoveSelf();
		(this.muParent as UiFlashMessage).updateVisibility();
	}

	public bClose_click() : void
	{
		this.remove();
	}
}
