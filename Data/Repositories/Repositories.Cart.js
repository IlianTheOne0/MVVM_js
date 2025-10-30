import InterfacesRepositories from "../../Infrastructure/Interfaces/Interfaces.Repositories.js";

class RepositoriesCart extends InterfacesRepositories
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getUserCart", "updateUserCart", "reduceMovieStock", "increaseMovieStock"]; }
	
	#repositoryLocalStorage = null;
	#repositoryTraktApi = null;

	constructor(repositoryLocalStorage, repositoryTraktApi)
	{
		super();

		if (RepositoriesCart.instance) { return RepositoriesCart.instance; }
		RepositoriesCart.instance = this;

		this.#repositoryLocalStorage = repositoryLocalStorage;
		this.#repositoryTraktApi = repositoryTraktApi;
	}

	async getUserCart(username)
	{
		const user = await this.#repositoryLocalStorage.getUserData(username);
		if (!user) { return null; }

		user.cart = await Promise.all
		(
			user.cart.map
			(
				async item =>
				{
					if (!item.poster || (JSON.stringify(item.poster) === JSON.stringify({}))) { return item; }
					const poster = await this.#repositoryTraktApi.getBlobMoviePoster(item.poster);
					return { ...item, poster: poster };
				}
			)
		);

		return user.cart || [];
	}

	async updateUserCart(username, data)
	{
		const user = await this.#repositoryLocalStorage.getUserData(username);
		if (!user) { return false; }
		
		for (let item of data)
		{
			if (!item.price) { item.price = await this.#repositoryTraktApi.getMoviePrice(item.id); }
		}
		await this.#repositoryLocalStorage.updateUserData(username, { ...user, cart: data });
		
		return true;
	}

	async reduceMovieStock(movieId, quantity) { return await this.#repositoryTraktApi.changeMovieStock(movieId, -quantity); }
	async increaseMovieStock(movieId, quantity) { return await this.#repositoryTraktApi.changeMovieStock(movieId, quantity); }
}

export { RepositoriesCart };