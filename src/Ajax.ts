export class Ajax
{
	public url : string;

	public query : Record<string, string>;

	public formData : Record<string, string>;

	public data : any;

	public method : HttpMethod;

	public thenCallback : (data) => void

	private errorCallback: (data) => void;

	public requestContentType: string;

	public requestHeaders: Record<string, string> = {};

	public jsonResult: boolean;

	constructor(url : string)
	{
		this.url = url;
	}

	public setQuery(query : Record<string, string>) : Ajax
	{
		this.query = query;
		return this;
	}

	public setData(data : any) : Ajax
	{
		this.data = data;
		return this;
	}

	public setFormData(formData : Record<string, string>) : Ajax
	{
		this.formData = formData;
		return this;
	}

	public then(then : (data) => void)
	{
		this.thenCallback = then;
		return this;
	}

	public error(error : (data) => void)
	{
		this.errorCallback = error;
		return this;
	}

	public promise() : Promise<any>
	{
		const prom = new Promise((resolve, reject) => this._call(resolve, reject));
		if (this.errorCallback) prom.catch(this.errorCallback);
		if (this.thenCallback) prom.then(this.thenCallback);

		return prom;
	}

	public call() : void
	{
		this._call(this.thenCallback, this.errorCallback);
	}

	protected _call(resolve, reject) {
		const req = new XMLHttpRequest();
		req.open(this.getMethod(), this.getFullUrl(), true);
		// let i = 1;
		//console.log("open");
		req.onload = (e : ProgressEvent) => {
			if (req.status >= 200 && req.status < 400) {
				//console.log("onload " + (i++));
				let resp = req.response;
				if (this.jsonResult && typeof resp === "string") resp = JSON.parse(resp);
				resolve(resp);
			}
			else
			{
				reject(req.response);
			}
		};
		req.onerror = (e : ProgressEvent) => reject(e);
		req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		const postData = this.getPostData();
		const setHeaders = () => {
			for(const hn in this.requestHeaders) req.setRequestHeader(hn, this.requestHeaders[hn]);
		}

		if (postData)
		{
			req.setRequestHeader("Content-Type", this.requestContentType || postData.contentType);
			setHeaders();
			req.send(postData.data);
		}
		else
		{
			setHeaders();
			req.send();
		}
	}

	private getMethod() : string
	{
		return this.method || ((this.formData || this.data) ? "POST" : "GET");
	}

	private getPostData() : {data: any, contentType? : string}|null
	{
		if (this.formData)
		{
			const fd = new FormData();
			this.prepareDataValues(
				this.formData,
				(k, v) => fd.append(k, v)
			);

			return {
				data: fd,
				contentType: "application/x-www-form-urlencoded"
			};
		}
		if (this.data)
		{
			if (typeof this.data === 'object' || Array.isArray(this.data))
			{
				return {
					data: JSON.stringify(this.data),
					contentType: "application/json"
				};
			}
			else return {
				data: this.data,
				contentType: "application/octet-stream"
			};
		}
		return null;
	}

	public getFullUrl() : string
	{
		let query = this.url;
		if (this.query)
		{
			query += "?";
			this.prepareDataValues(
				this.query,
				(k, v) => query += encodeURIComponent(k) + "=" + encodeURIComponent(v) + "&"
			)
		}
		return query;
	}

	private prepareDataValues(items : Record<string, any>, callback : (k : string, v : any) => void) : void
	{
		for (const p in items)
		{
			if (items.hasOwnProperty(p))
			{
				let v = items[p];
				if (v !== null)
				{
					if (v instanceof Date)
					{
						v = v.toISOString();
					}
					callback(p, v);
				}
			}
		}
	}
}

export type HttpMethod = "GET"|"POST"|"HEAD"|"PUT"|"PATCH"|null;

