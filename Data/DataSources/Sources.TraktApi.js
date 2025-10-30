// import XMLHttpRequest from "xhr2";

import UtilsCheckers from "../../Infrastructure/Utils/Utils.Checkers.js";

class SourcesTraktApi
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["initialize", "testConnection", "getMovies", "getMovieById"]; }

	#client = null;
	#clientId = null;

	constructor(clientId)
	{
		if (SourcesTraktApi.instance) { return SourcesTraktApi.instance; }
		SourcesTraktApi.instance = this;

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
			if (typeof window === 'undefined')
			{
				if (body) { request.setRequestHeader('Content-Length', Buffer.byteLength(JSON.stringify(body))); }
			}

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

	async #getMovieImages(movieId)
	{
		try
		{
			const endpoint = `movies/${movieId}?extended=images`;
			const response = await this.#query(endpoint, "GET");

			if (!response || !response.images) { throw new Error("Invalid response or missing images from Trakt API"); }
			return response.images.poster[0];
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

	async getMovies(pagination = { page: 1, limit: 10 }, filters = {})
	{
		try
		{
			UtilsCheckers.checkArgument(pagination, "object");
			UtilsCheckers.checkArgument(pagination.page, "number");
			UtilsCheckers.checkArgument(pagination.limit, "number");
			if (filters !== null) { UtilsCheckers.checkArgument(filters, "object"); }
			
			const endpoint = `calendars/all/movies`;

			const queryParams = new URLSearchParams();
			if (filters.dateFrom) { queryParams.append("start_date", filters.dateFrom); }
			if (filters.dateTo) { queryParams.append("end_date", filters.dateTo); }
			if (filters.title) { queryParams.append("query", filters.title); }

			const endpointWithFilters = `${endpoint}?${queryParams.toString()}`;
			const filteredMovies = await this.#query(endpointWithFilters, "GET");

			if (!filteredMovies || !Array.isArray(filteredMovies)) { throw new Error("Invalid response from Trakt API"); }

			const page = pagination.page;
			const limit = pagination.limit;
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;

			const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
			
			for (const movie of paginatedMovies) { movie.poster = await this.#getMovieImages(movie.movie.ids.trakt); }
			
			return paginatedMovies;
		}
		catch (error) { throw error; }
	}

	async getMovieById(movieId)
	{
		try
		{
			const endpoint = `movies/${movieId}`;
			const movie = await this.#query(endpoint, "GET");
			if (!movie) { throw new Error("Invalid response from Trakt API"); }

			movie.poster = await this.#getMovieImages(movieId);
			return movie;
		}
		catch (error) { throw error; }
	}
}

export { SourcesTraktApi };