import XMLHttpRequest from "xhr2";

import UtilsCheckers from "../../Infrastructure/Utils/Checkers.js";

class SourcesTraktApi
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["initialize", "testConnection"]; }

	#client = null;
	#clientId = null;

	constructor(clientId)
	{
		UtilsCheckers.checkArgument(clientId, "string");
		
		this.#clientId = clientId;
	}

	async #query(endpoint, method = "GET", body = null)
	{
		try
		{
			if (!this.#client) { throw new Error("Client is not initialized"); }

			UtilsCheckers.checkArgument(endpoint, "string");
			UtilsCheckers.checkArgument(method, "GET", "POST", "PUT", "DELETE", "PATCH");
			if (body !== null) { UtilsCheckers.checkArgument(body, "object"); }

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
			
			if (!response) { throw new Error("Invalid response from Trakt API", "ASD"); }
			return true;
		}
		catch (error) { throw error; }
	}
}

export default SourcesTraktApi;