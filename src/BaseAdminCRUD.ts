import {IMuWidget} from "./IMuWidget";
import {App} from "./App";
import {UiFlashMessageContainer} from "./UiFlashMessage";
import {BaseForm} from "./BaseForm";
import {BaseAdminListItem} from "./BaseAdminListItem";

export abstract class BaseAdminCRUD extends IMuWidget
{
	public app : App;

	public appConfig : any;

	public loader : UiFlashMessageContainer;

	public flashMessage : UiFlashMessageContainer;

	public editor: BaseForm;

	public list : BaseAdminListItem;

	public afterIndex()
	{
		this.editor = (this.muNamedWidget.editor as BaseForm);
		this.list = (this.muNamedWidget.list as BaseAdminListItem);
		this.app = this.muParent["app"];
		this.editor.visible(false);

		setTimeout(() => this.listLoad(), 1);
	}

	public bReload_click()
	{
		this.listLoad();
	}

	public item_edit(sender, ev, id)
	{
		this.itemLoad(id, (data) => {
			this.editor.showErrors();
			this.editor.muBindData(data);
			this.editor.visible(true);
			this.editor.container.scrollIntoView();
			this.editor.setFormMode("edit");
			this.editor.afterLoad();
		});
	}

	public bAdd_click(sender, ev, id)
	{
		this.editor.showErrors();
		this.editor.muBindData(this.getEmptyItem());
		this.editor.visible(true);
		this.editor.container.scrollIntoView();
		this.editor.setFormMode("new");
		this.editor.afterLoad();
	}

	public item_delete(sender, ev, id)
	{

	}

	public editor_save(sender, ev, id)
	{
		this.itemSave(
			id,
			this.editor.muFetchData(),
			(data) => {
				if (data.success)
				{
					this.editor.visible(false);
					this.listLoad();
					App.instance.flashMessage.add("Uloženo");
					this.afterSaved(data);
				}
				else if (data.errors)
				{
					this.editor.showErrors(data.errors);
					App.instance.flashMessage.add("Zadané údaje obsahují chybu.");
				}
			}
		)
	}

	public editor_cancel(sender, ev, id)
	{
		this.editor.visible(false);
	}

	protected abstract listLoad();

	protected abstract itemLoad(id, callback : (data) => void) : any;

	protected abstract itemSave(id, data, callback : (data) => void) : any;

	protected abstract itemDelete(id, callback : (data) => void) : any;

	protected abstract getEmptyItem() : any;

	protected afterSaved(data) { }
}