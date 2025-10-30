import { Router } from "../Router.js";

class ControllersCart
{
	static getRequiredFields() { return ["model", "view", "name"]; }
	static getRequiredMethods() { return ["initialize"]; }
	
	name = "cart_controller";
	#htmlTemplate = null;

	constructor(modelCart, viewCart)
	{
		if (ControllersCart.instance) { return ControllersCart.instance; }
		ControllersCart.instance = this;

		this.model = modelCart;
		this.view = viewCart;

		this.#bindContainerEvents(); 
	}

	async initialize(html)
	{
		this.#htmlTemplate = html;

        await this.#updateCartView();
	}

	async #updateCartView()
	{
		const cartData = await this.model.getUserCart();

		this.view.render(this.#htmlTemplate, cartData);
		
		this.#bindSummaryEvents(cartData);
	}

	#bindContainerEvents()
	{
		this.view.getElement('#app').addEventListener
		(
			'click',
			async (event) =>
			{
				const button = event.target;
				const itemId = button.dataset.itemId;

				if (!itemId) { return; }

				if (button.classList.contains('increase-quantity-button')) { await this.#increaseItemQuantity(itemId); }
				else if (button.classList.contains('decrease-quantity-button')) { await this.#decreaseItemQuantity(itemId); }
				else if (button.classList.contains('remove-item-button')) { await this.#removeItemFromCart(itemId); }
			}
		);
	}

	#bindSummaryEvents(cart)
	{
		if (!cart || cart.length === 0) { return; }

		this.#payCart();
		this.#clearCart();
		this.#continueShopping();
	}

	async #increaseItemQuantity(itemId)
	{
		const cart = await this.model.getUserCart();

		const item = cart.find(item => item.id == itemId);
		if (!item) { return; }

		if (item.quantity >= 10) { return; }
		item.quantity += 1;
		
		await this.model.updateTicket(item.id, item);
		await this.#updateCartView();
	}

	async #decreaseItemQuantity(itemId)
	{
		const cart = await this.model.getUserCart();

		const item = cart.find(item => item.id == itemId);
		if (!item || item.quantity <= 1) { return; }

		item.quantity -= 1;
		await this.model.updateTicket(item.id, item);
		
		await this.#updateCartView();
	}

	async #removeItemFromCart(itemId) { await this.model.removeFromCart(itemId); await this.#updateCartView(); }

	#payCart()
	{

		const payButton = this.view.getElement('.pay-button');
		if (!payButton) { return; }

		payButton.addEventListener('click', async () => { alert('Payment functionality is not implemented yet'); });
	}

	#continueShopping()
	{
		const continueButton = this.view.getElement('.continue-shopping-button');
		if (!continueButton) { return; }

		continueButton.addEventListener('click', async () => { await this.#goToTickets(); });
	}

	#clearCart()
	{
		const clearButton = this.view.getElement('.clear-cart-button');
		if (!clearButton) { return; }

		clearButton.addEventListener('click', async () => { await this.model.clearCart(); await this.#updateCartView(); });
	}

	async #goToTickets() { await (new Router()).navigateTo('/tickets'); }
}

export { ControllersCart };