import {IMuWidget} from "./IMuWidget";

export class BaseForm extends IMuWidget
{
	public id: number;

	private formMode: FormMode;

	public afterIndex()
	{
		this.muRegisterEvent("save", "cancel");
	}

	public showErrors(errors: Record<string, string[]> = {})
	{
		let hError : HTMLElement;
		for(const id in this.ui)
		{
			let field;
			let hError;
			if (id.startsWith("error-")) {
				field = id.substr(6);
				hError = this.ui[id]
			}
			else if (this.ui[id]["errorMessageElement"]) {
				field = id;
				hError = this.ui[id]["errorMessageElement"];
			}
			if (!field) continue;
			hError.innerHTML = "";
			const hasError = field in errors;
			hError.style.display = hasError ? null : "none";
			const input = this.ui[field];
			input.classList.toggle("is-invalid", hasError);
			if (hasError)
			{
				const hList = document.createElement("ul");
				hError.appendChild(hList);
				for(const message of errors[field])
				{
					const hMessage = document.createElement("li");
					hMessage.innerText = message;
					hList.appendChild(hMessage);
				}
			}
		}
	}

	public bSave_click() { this.muDispatchEvent("save", this.id); }

	public bCancel_click() { this.muDispatchEvent("cancel"); }

	public visible(visible : boolean)
	{
		this.container.style.display = visible ? null : "none";
	}

	public setFormMode(formMode : FormMode)
	{
		this.formMode = formMode;
	}

	public afterLoad() { }
}

export type FormMode = "new"|"edit";