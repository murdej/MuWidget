import {Ajax} from "./Ajax";

export class BaseCL {
	public context : any = {};

	public url : string;

	public onLoading : ()=>any = null;

	public onLoaded : (any)=>void = null;

	public onError : (any)=>void = null;

	protected callMethod(methodName : string, args/* : IArguments*/) : Promise<any> {
		const ajax = new Ajax(this.url);
		// ajax.requestContentType = "application/json";
		ajax.setData({
			name: methodName,
			context: this.context,
			pars: [...args]
		});
		return new Promise((resolve, reject) => {
			let loadingHandle : any;
			if (this.onLoading) loadingHandle = this.onLoading();
			ajax.promise().then((response : CallMethodResponse|string) => {
				if (typeof response === "string") response = JSON.parse(response) as CallMethodResponse;
				if (response.status == "ok")
				{
					if (this.onLoaded) this.onLoaded(loadingHandle);
					resolve(response.response);
				}
				else
				{
					if (this.onLoaded) this.onLoaded(loadingHandle);
					if (reject) reject(response.exception);
					else {
						// alert("Chyba aplikace: " + response.Exception.Message);
						throw new Error(response.exception);
					}
				}
			});
		});
	}
}

export type CallMethodResponse = {
	response?: any,
	status: "ok"|"failed"|string,
	exception?: {
		Detail: string,
		Message: string
	}|any
}