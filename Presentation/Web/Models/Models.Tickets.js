class ModelsTickets
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getMovies", "getMoviePoster"]; }

	#service = null;

	constructor(serviceTickets)
	{
		if (ModelsTickets.instance) { return ModelsTickets.instance; }
		ModelsTickets.instance = this;

		this.#service = serviceTickets;
	}

	async getMovies(pagination = { page: 10, limit: 10 }, filters = {}) { return await this.#service.getMovies(pagination, filters); }
	async getMoviePoster(movieId) { return (await this.#service.getMovieById(movieId)).poster; }
}

export { ModelsTickets };