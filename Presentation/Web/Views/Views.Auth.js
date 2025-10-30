class ViewsAuth
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "render"]; }

	#app = null;

	constructor()
	{
		if (ViewsAuth.instance) { return ViewsAuth.instance; }
		ViewsAuth.instance = this;
		
		this.#app = this.getElement('#app');
	}

	getElement(selector) { return document.querySelector(selector); }
	render(html, bindEvents) { this.#app.innerHTML = html; if (bindEvents) { bindEvents(); } }
}

export { ViewsAuth };