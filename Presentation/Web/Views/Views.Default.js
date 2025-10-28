class ViewsDefault
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "render"]; }

	#app = null;

	constructor() { this.#app = this.getElement('#app'); }

	getElement(selector) { return document.querySelector(selector); }
	render(html) { this.#app.innerHTML = html; }
}

export { ViewsDefault };