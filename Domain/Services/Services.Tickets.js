class ServicesTickets
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getMovies"]; }

	#repository = null;
	#cache = null;

	constructor(repository, cache)
	{
		if (ServicesTickets.instance) {  return ServicesTickets.instance; }
		ServicesTickets.instance = this;

		this.#repository = repository;
		this.#cache = cache;
	}

	async getMovies(pagination = { page: 10, limit: 10 })
	{
		const cacheKey = `movies_page${pagination.page}_limit${pagination.limit}`;
		if (this.#cache.has(cacheKey)) { return this.#cache.get(cacheKey); }

		try
		{
			const movies = await this.#repository.getTrendingMovies(pagination);
			this.#cache.set(cacheKey, movies);
			return movies;
		}
		catch (error) { console.error(error); return null; }
	}
}

export { ServicesTickets };