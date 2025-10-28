import UtilsCheckers from "../../../Infrastructure/Utils/Utils.Checkers.js";

class ViewsHome
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "render", "updateAuthBlock"]; }

	#app = null;

	constructor() { this.#app = this.getElement('#app'); }

	getElement(selector) { return document.querySelector(selector); }
	render(html, bindEvents) { this.#app.innerHTML = html; if (bindEvents) { bindEvents(); } }

	async updateAuthBlock(isLoggedIn = false, username = null)
	{
		UtilsCheckers.checkArgument(isLoggedIn, "boolean");

		const anonUser = this.getElement('#anon-user');
		const loggedUser = this.getElement('#logged-user');
		const spanUsername = this.getElement('#user-name');

		if (!anonUser || !loggedUser || !spanUsername) { console.warn("Elements for user status not found"); return; }

		if (isLoggedIn) { anonUser.classList.add('hidden'); loggedUser.classList.remove('hidden'); spanUsername.textContent = username; return; }
		anonUser.classList.remove('hidden'); loggedUser.classList.add('hidden');
	}
}

export { ViewsHome };