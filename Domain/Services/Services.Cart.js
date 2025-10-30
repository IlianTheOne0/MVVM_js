import InterfacesServices from "../../Infrastructure/Interfaces/Interfaces.Services.js";

class ServicesCart extends InterfacesServices
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getUserCart", "addToUserCart", "removeFromUserCart"]; }

	#repository = null;

	constructor(repositoryCart)
	{
		super();
		
		if (ServicesCart.instance) { return ServicesCart.instance; }
		ServicesCart.instance = this;

		this.#repository = repositoryCart;
	}

	async getUserCart(username) { return await this.#repository.getUserCart(username); }
	
	async addToUserCart(username, data)
	{
		const stockReduced = await this.#repository.reduceMovieStock(data.id, data.quantity);
		if (!stockReduced) { throw new Error("Not enough seats"); }

		const userCart = await this.#repository.getUserCart(username);
		if (userCart === null) { await this.#repository.increaseMovieStock(data.id, data.quantity); return false; }

		const existingItemIndex = userCart.findIndex(item => item.id == data.id);
		let updatedCart = [];

		if (existingItemIndex !== -1)
		{
			updatedCart = [...userCart];

			const existingItem = updatedCart[existingItemIndex];
			const newQuantity = existingItem.quantity + data.quantity;

			updatedCart[existingItemIndex] = { ...existingItem, quantity: newQuantity };
		}
		else {  updatedCart = [...userCart, data]; }

		return await this.#repository.updateUserCart(username, updatedCart);
	}
	async removeFromUserCart(username, itemId)
	{
		const userCart = await this.#repository.getUserCart(username);
		if (!userCart) { return false; }

		const itemToRemove = userCart.find(item => item.id == itemId);
		if (!itemToRemove) { return false; }

		const updatedCart = userCart.filter(item => item.id != itemId);

		await this.#repository.increaseMovieStock(itemId, itemToRemove.quantity);
		return await this.#repository.updateUserCart(username, updatedCart);
	}
	async updateUserCart(username, itemId, newItemData)
	{
		const userCart = await this.#repository.getUserCart(username);
		if (!userCart) { return false; }

		const itemIndex = userCart.findIndex(item => item.id == itemId);
		if (itemIndex === -1) { return false; }

		const currentItem = userCart[itemIndex];
		if (newItemData.quantity > currentItem.quantity)
		{
			const quantityDifference = newItemData.quantity - currentItem.quantity;
			const stockReduced = await this.#repository.reduceMovieStock(itemId, quantityDifference);
			if (!stockReduced) { throw new Error("Not enough seats"); }
		}
		else if (newItemData.quantity < currentItem.quantity)
		{
			const quantityDifference = currentItem.quantity - newItemData.quantity;
			await this.#repository.increaseMovieStock(itemId, quantityDifference);
		}

		userCart[itemIndex] = { ...currentItem, ...newItemData };
		return await this.#repository.updateUserCart(username, userCart);
	}
}

export { ServicesCart };