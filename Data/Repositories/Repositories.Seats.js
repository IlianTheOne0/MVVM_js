class RepositoriesSeats
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getAvailableSeats"]; }

	constructor()
	{
		if (RepositoriesSeats.instance) { return RepositoriesSeats.instance; }
		RepositoriesSeats.instance = this;
	}

	async getAvailableSeats(showingId) { return showingId % 100; }
}

export { RepositoriesSeats };