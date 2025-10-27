import { Router } from "../Router.js";

class ControllersNotFound
{
	static getRequiredFields() { return ["name"]; }
	static getRequiredMethods() { return ["initialize"]; }
	
	name = "notFound_controller";

	constructor(modelNotFound, viewNotFound)
	{
		if (ControllersNotFound.instance) { return ControllersNotFound.instance; }
		ControllersNotFound.instance = this;

		this.model = modelNotFound;
		this.view = viewNotFound;
	}

	async initialize(html) { this.view.render(html, this.#bindEvents.bind(this)); }

	#bindEvents()
	{
		const homeButton = this.view.getElement('#homeButton');
		if (homeButton) { homeButton.addEventListener("click", async () => { await this.#goHome(); }); }
	}

	async #goHome() { await (new Router()).navigateTo("/"); }
}

export { ControllersNotFound };