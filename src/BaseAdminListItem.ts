import {IMuWidget} from "./IMuWidget";

export class BaseAdminListItem extends IMuWidget
{
	public id;

	public afterIndex()
	{
		this.muRegisterEvent("edit", "delete");
	}

	public bDelete_click()
	{
		if (confirm("Opravdu smazat?"/* + this.ui. + "'"*/)) this.muDispatchEvent("delete", this.id);
	}

	public bEdit_click()
	{
		this.muDispatchEvent("edit", this.id);
	}
}