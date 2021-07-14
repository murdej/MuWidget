import { IMuWidget } from "./IMuWidget";

export class UiFlashMessageContainer extends IMuWidget
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

	public add(text : string) : UiFlashMessage
	{
		var item = this.muWidgetFromTemplate("item", "items", { text: text }) as UiFlashMessage;
		this.updateVisibility();
		return item;
	}
}

export class UiFlashMessage extends IMuWidget
{
	public text : string;

	public afterIndex()
	{
		if (this.text) this.ui.text.innerText = this.text;
	}

	public remove() : void
	{
		this.muRemoveSelf();
		(this.muParent as UiFlashMessageContainer).updateVisibility();
	}

	public bClose_click() : void
	{
		this.remove();
	}
}
