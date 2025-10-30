import { Router } from "../Router.js"

class ControllersHeader
{
	static getRequiredFields() { return ["model", "view", "name"]; }
	static getRequiredMethods() { return ["initialize"]; }
	
	name = "header_controller";

	constructor(modelHeader, viewHeader)
	{
		if (ControllersHeader.instance) { return ControllersHeader.instance; }
		ControllersHeader.instance = this;

		this.model = modelHeader;
		this.view = viewHeader;
	}

	async initialize(html) { this.view.render(html, this.#bindEvents.bind(this)); this.view.updateAuthBlock(this.model.isLoggedIn()); }

	#bindEvents()
	{
		this.view.getElement("#logout-link").addEventListener
		(
			'click',
			async (event) =>
			{
				event.preventDefault();
				await this.#logout();
			}
		);
	}

	async #logout()
	{
		const result = await this.model.logout();

		if (result) { alert("Logout successful!"); await (new Router()).navigateTo("/auth"); }
		else { alert("Logout failed. Please try again"); }
	}
}

export { ControllersHeader };