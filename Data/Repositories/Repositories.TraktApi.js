import UtilsCheckers from "../../Infrastructure/Utils/Utils.Checkers.js";

import InterfacesRepositories from "../../Infrastructure/Interfaces/Interfaces.Repositories.js";

class RepositoriesTraktApi extends InterfacesRepositories
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getMovies", "getMoviePrice", "changeMovieStock"]; }

	#source = null;
	#cache = null;
	#imageRepository = null;
	#seatsRepository = null;

	constructor(source, cache, imageRepository, seatsRepository)
	{
		super();
		
		if (RepositoriesTraktApi.instance) { return RepositoriesTraktApi.instance; }
		RepositoriesTraktApi.instance = this;

		this.#source = source;
		this.#cache = cache;
		this.#imageRepository = imageRepository;
		this.#seatsRepository = seatsRepository;
	}

	async #transformMovies(movies)
	{
		if (movies.length === 0) { return []; }

		const newMovies = [];
		for (const movie of movies)
		{
			newMovies.push
			(
				{
					id: movie.movie.ids.trakt,
					title: movie.movie.title,
					date: movie.released,
					seatsAvailable: await this.#seatsRepository.getAvailableSeats(movie.movie.ids.trakt),
					poster: await this.#imageRepository.getImage(movie.poster)
				}
			);
		}
		return newMovies;
	}

	async #transformMovie(movie)
	{
		return {
			id: movie.ids.trakt,
			title: movie.title,
			date: movie.released,
			seatsAvailable: await this.#seatsRepository.getAvailableSeats(movie.ids.trakt),
			poster: movie.poster
		};
	}


	async getMovies(pagination = { page: 1, limit: 10 }, filters = {})
	{
		const cacheKey = `movies_page${pagination.page}_limit${pagination.limit}_filters${JSON.stringify(filters)}`;
		if (this.#cache.has(cacheKey)) { return this.#cache.get(cacheKey); }

		try
		{
			const movies = await this.#source.getMovies(pagination, filters);

			const newMovies = await this.#transformMovies(movies);

			this.#cache.set(cacheKey, newMovies, 300);

			(
				async () =>
				{
					try
					{
						const nextPages = [pagination.page + 1, pagination.page + 2];
						for (const page of nextPages)
						{
							const key = `movies_page${page}_limit${pagination.limit}_filters${JSON.stringify(filters)}`;
							if (this.#cache.has(key)) { continue; }

							const nextMoviesRaw = await this.#source.getMovies({ page, limit: pagination.limit }, filters);
							if (!nextMoviesRaw || !Array.isArray(nextMoviesRaw)) { this.#cache.set(key, [], 300); continue; }

							const transformed = await this.#transformMovies(nextMoviesRaw);
							this.#cache.set(key, transformed, 300);
						}
					}
					catch (error) {}
				}
			)();

			return newMovies;
		}
		catch (error) { throw error; }
	}

	async getMoviePrice(movieId)
	{
		try
		{
			const price = await Promise.resolve((Math.random() * (15 - 5) + 5).toFixed(2));
			return price;
		}
		catch (error) { throw error; }
	}

	async changeMovieStock(movieId, quantity)
	{
		try
		{
			const availableSeats = await this.#seatsRepository.getAvailableSeats(movieId);
			const newSeats = availableSeats + quantity;
			if (newSeats < 0) { return false; }
			await this.#seatsRepository.setAvailableSeats(movieId, newSeats);
			return true;
		}
		catch (error) { throw error; }
	}

	async getMovieById(movieId)
	{
		try
		{
			const cacheKey = `movie_id${movieId}`;
			if (this.#cache.has(cacheKey)) { return this.#cache.get(cacheKey); }

			const movie = await this.#source.getMovieById(movieId);
			if (!movie) { return null; }

			const transformedMovie = await this.#transformMovie(movie);
			this.#cache.set(cacheKey, transformedMovie, 300);
			return transformedMovie;
		}
		catch (error) { throw error; }
	}

	async getBlobMoviePoster(posterUrl)
	{
		try
		{
			const poster = await this.#imageRepository.getImage(posterUrl);
			return poster;
		}
		catch (error) { throw error; }
	}
}

export { RepositoriesTraktApi };