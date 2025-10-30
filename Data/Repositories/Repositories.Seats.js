import InterfacesRepositories from "../../Infrastructure/Interfaces/Interfaces.Repositories.js";

class RepositoriesSeats extends InterfacesRepositories
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getAvailableSeats", "setAvailableSeats"]; }

	#cache;

	constructor(cache)
	{
		super();
		
		if (RepositoriesSeats.instance) { return RepositoriesSeats.instance; }
		RepositoriesSeats.instance = this;

		this.#cache = cache;
	}

	async getAvailableSeats(showingId)
	{
		const cacheKey = `seats_${showingId}`;
		if (this.#cache.has(cacheKey)) { return this.#cache.get(cacheKey); }

		const defaultSeats = 100;
		this.#cache.setPermanent(cacheKey, defaultSeats);
		return defaultSeats;
	}

	async setAvailableSeats(showingId, seats)
	{
		const cacheKey = `seats_${showingId}`;
		
		this.#cache.setPermanent(cacheKey, seats);
		return true;
	}
}

export { RepositoriesSeats };