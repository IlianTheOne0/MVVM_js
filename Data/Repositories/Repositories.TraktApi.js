class RepositoriesTraktApi
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getTrendingMovies"]; }

	#source = null;
	#cache = null;
	#imageRepository = null;
	#seatsRepository = null;

	constructor(source, cache, imageRepository, seatsRepository)
	{
		if (RepositoriesTraktApi.instance) { return RepositoriesTraktApi.instance; }
		RepositoriesTraktApi.instance = this;

		this.#source = source;
		this.#cache = cache;
		this.#imageRepository = imageRepository;
		this.#seatsRepository = seatsRepository;
	}

	async getTrendingMovies(pagination = { page: 1, limit: 10 })
	{
		const cacheKey = `trendingMovies_page${pagination.page}_limit${pagination.limit}`;
		if (this.#cache.has(cacheKey)) { return this.#cache.get(cacheKey); }

		try
		{
			const movies = await this.#source.getTrendingMovies(pagination);
			const newMovies = [];
			for (const movie of movies)
			{
				newMovies.push
				(
					{
						id: movie.movie.ids.trakt,
						title: movie.movie.title,
						year: movie.movie.year,
						seatsAvailable: await this.#seatsRepository.getAvailableSeats(movie.movie.ids.trakt),
						poster: await this.#imageRepository.getImage(movie.poster)
					}
				)
			}

			this.#cache.set(cacheKey, newMovies, 300);
			return newMovies;
		}
		catch (error) { throw error; }
	}
}

export { RepositoriesTraktApi };