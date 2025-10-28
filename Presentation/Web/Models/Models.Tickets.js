class ModelsTickets
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getMovies"]; }

	#ticketsService = null;

	constructor(ticketsService)
	{
		if (ModelsTickets.instance) { return ModelsTickets.instance; }
		ModelsTickets.instance = this;

		this.#ticketsService = ticketsService;
	}

	async getMovies(pagination = { page: 10, limit: 10 }) { return await this.#ticketsService.getMovies(pagination); }
}

export { ModelsTickets };