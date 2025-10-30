class ViewsCart
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "getElements", "render", "countSummary"]; }

	#app = null;

	constructor()
	{
		if (ViewsCart.instance) { return ViewsCart.instance; }
		ViewsCart.instance = this;

		this.#app = this.getElement('#app');
	}

	getElement(selector) { return document.querySelector(selector); }
	getElements(selector) { return this.#app.querySelectorAll(selector); }

	render(html, cart, bindEvents)
	{
		this.#app.innerHTML = html;
		if (bindEvents) { bindEvents(); }
		
		this.#addCartItems(cart);
	}

	#addCartItems(cart)
	{
		const cartContainer = this.getElement('.cart-items-container');
		const emptyCartMessage = this.getElement('.empty-cart-message');
		if (!cartContainer) { return; }

		if (!cart || cart.length === 0) {  cartContainer.classList.add('hidden'); emptyCartMessage.classList.remove('hidden'); return; }
		cartContainer.classList.remove('hidden');
		emptyCartMessage.classList.add('hidden');
		
		cart.forEach
		(
			item =>
			{
				const itemElement = document.createElement('div');
				itemElement.classList.add('cart-item');
				itemElement.innerHTML +=
				`
					<img src="" alt="${item.title}" class="poster">
					<div class="item-details">
						<h3 class="item-title">${item.title}</h3>
						<p class="item-quantity">Quantity: <span class="quantity-value">${item.quantity}</span></p>
						<p class="item-price">Price: $<span class="price-value">${item.price}</span></p>
					</div>
					<div class="item-actions">
						<button class="increase-quantity-button quantity-button" data-item-id="${item.id}">+</button>
						<button class="remove-item-button" data-item-id="${item.id}">Remove</button>
						<button class="decrease-quantity-button quantity-button" data-item-id="${item.id}">-</button>
					</div>
				`;

				const imgElement = itemElement.querySelector('img');

				if (item.poster instanceof Blob) 
				{
					const objectUrl = URL.createObjectURL(item.poster); 
					imgElement.src = objectUrl; 
					imgElement.onload = () => { URL.revokeObjectURL(objectUrl); }; 
				}
				else if (!item.poster || (typeof item.poster === 'object' && Object.keys(item.poster).length === 0)) 
				{ 
					imgElement.src = 'https://github.com/IlianTheOne0/MVVM_js/blob/hm/task/Presentation/Assets/Posters/default-poster.jpg?raw=true';
				}

				cartContainer.appendChild(itemElement);
			}
		);

		this.countSummary(cart);
	}

	countSummary(cart)
	{
		const cartContainer = this.getElement('.cart-items-container');
		if (!cartContainer) { return; }
		
		cartContainer.innerHTML +=
		`
			<div class="cart-summary">
				<p class="total-price">Total: $<span class="total-price-value">${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span></p>
				<div class="buttons-container">
					<button class="pay-button">Pay</button>
					<button class="clear-cart-button">Clear Cart</button>
					<button class="continue-shopping-button">Continue Shopping</button>
				</div>
			</div>
		`;
	}
}

export { ViewsCart };