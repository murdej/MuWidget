import {IMuWidget} from "../../src/IMuWidget";

export class CharCounter extends IMuWidget
{
	public maxLength : number = 50;

	afterIndex() {
		this.ui.input.maxLength = this.maxLength;
		this.updateWidget();
	}

	input_change() {
		this.updateWidget();
	}

	private updateWidget() {
		const l = this.ui.input.value.length;
		this.ui.info.innerText = l + " / " + this.maxLength;
	}
}