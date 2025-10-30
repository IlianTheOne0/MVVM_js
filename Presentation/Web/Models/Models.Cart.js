class ModelsCart
{
static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getUserCart", "updateUserCart"]; }

	#serviceCart = null;
	#serviceUser = null;

	constructor(serviceCart, serviceUser)
	{
		if (ModelsCart.instance) { return ModelsCart.instance; }
		ModelsCart.instance = this;

		this.#serviceCart = serviceCart;
		this.#serviceUser = serviceUser;
	}

	async getUserCart() { return await this.#serviceCart.getUserCart((await this.#serviceUser.getUserData()).Username); }
	
	async bookTickets(tickets) { return await this.#serviceCart.addToUserCart((await this.#serviceUser.getUserData()).Username, tickets); }
	async removeFromCart(itemId) { return await this.#serviceCart.removeFromUserCart((await this.#serviceUser.getUserData()).Username, itemId); }
	async updateTicket(itemId, newTicketData) { return await this.#serviceCart.updateUserCart((await this.#serviceUser.getUserData()).Username, itemId, newTicketData); }
	
	async clearCart()
	{
		const userCart = await this.getUserCart();
		if (!userCart || userCart.length === 0) { return false; }

		for (const item of userCart) { await this.#serviceCart.removeFromUserCart((await this.#serviceUser.getUserData()).Username, item.id); }
		return true;
	}
}

export { ModelsCart };