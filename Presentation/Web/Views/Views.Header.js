import UtilsCheckers from "../../../Infrastructure/Utils/Checkers.js";

class ViewsHeader
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "render", "updateAuthBlock"]; }

	#app = null;

	constructor() { this.#app = this.getElement('#header-container'); }

	getElement(selector) { return document.querySelector(selector); }
	render(html, bindEvents) { this.#app.innerHTML = html; if (bindEvents) { bindEvents(); } }

	updateAuthBlock(isLoggedIn = false)
	{
		UtilsCheckers.checkArgument(isLoggedIn, "boolean");
		
		const loginLink = this.getElement('#login-link');
		const logoutLink = this.getElement('#logout-link');
		if (!loginLink || !logoutLink) { console.warn("Elements for user status not found"); return; }

		if (isLoggedIn) { loginLink.classList.add('hidden'); logoutLink.classList.remove('hidden'); return; }
		loginLink.classList.remove('hidden'); logoutLink.classList.add('hidden');
	}
}

export { ViewsHeader };