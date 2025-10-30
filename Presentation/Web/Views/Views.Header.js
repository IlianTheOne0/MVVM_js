import UtilsCheckers from "../../../Infrastructure/Utils/Utils.Checkers.js";

class ViewsHeader
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "render", "updateAuthBlock"]; }

	#app = null;

	constructor()
	{
		if (ViewsHeader.instance) { return ViewsHeader.instance; }
		ViewsHeader.instance = this;

		this.#app = this.getElement('#header-container');
	}

	getElement(selector) { return document.querySelector(selector); }
	render(html, bindEvents) { this.#app.innerHTML = html; if (bindEvents) { bindEvents(); } }

	updateAuthBlock(isLoggedIn = false)
	{
		UtilsCheckers.checkArgument(isLoggedIn, "boolean");
		
		const loginLink = this.getElement('#login-link');
		const logoutLink = this.getElement('#logout-link');
		const ticketsLink = this.getElement('#tickets-link');
		const cartLink = this.getElement('#cart-link');

		if (!loginLink || !logoutLink) { throw new Error("Header elements not found"); }
		if (!ticketsLink || !cartLink) { throw new Error("Header elements not found"); }

		loginLink.classList = (isLoggedIn ? 'hidden' : '');
		logoutLink.classList = (isLoggedIn ? '' : 'hidden');

		ticketsLink.classList = (isLoggedIn ? '' : 'hidden');
		cartLink.classList = (isLoggedIn ? '' : 'hidden');
	}
}

export { ViewsHeader };