import XMLHttpRequest from "xhr2";

class SourcesTraktApi
{
	static getRequiredFields() { return ["#client", "#clientId"]; }
	static getRequiredMethods() { return ["#query", "initialize", "testConnection"]; }

	#client = null;
	#clientId = null;

	constructor(clientId) { if (!clientId || typeof clientId !== "string") { throw new Error("Invalid clientId"); } this.#clientId = clientId; }

	async #query(endpoint, method = "GET", body = null)
	{
		try
		{
			if (!this.#client) { throw new Error("Client is not initialized"); }
			if (!endpoint || typeof endpoint !== "string") { throw new Error("Invalid endpoint"); }

			const request = this.#client;
			const url = `https://api.trakt.tv/${endpoint}`;
			
			request.open(method, url);
			request.setRequestHeader('Content-Type', 'application/json');
			request.setRequestHeader('trakt-api-version', '2');
			request.setRequestHeader('trakt-api-key', this.#clientId);
			if (body) { request.setRequestHeader('Content-Length', Buffer.byteLength(JSON.stringify(body))); }

			await new Promise
			(
				(resolve, reject) =>
				{
					request.onload = () => resolve();
					request.onerror = () => reject(new Error("Network error"));
					request.ontimeout = () => reject(new Error("Request timed out"));
			
					if (body) { request.send(JSON.stringify(body)); }
					else { request.send(); }
				}
			);

			if (request.status < 200 || request.status >= 300) { throw new Error(`Request failed with status ${request.status}`); }

			return JSON.parse(request.responseText);
		}
		catch (error) { throw error; }
	}

	async initialize()
	{
		try { this.#client = new XMLHttpRequest(); }
		catch (error) { throw error; }

		return true;
	}

	async testConnection()
	{
		try
		{
			const response = await this.#query("calendars/all/movies/2014-09-01/1");
			
			if (!response) { throw new Error("Invalid response from Trakt API"); }
			return true;
		}
		catch (error) { throw error; }
	}
}

export default SourcesTraktApi;