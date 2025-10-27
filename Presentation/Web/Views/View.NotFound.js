class ViewsNotFound
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "render"]; }

	#app;

	constructor()
	{
		if (ViewsNotFound.instance) { return ViewsNotFound.instance; }
		ViewsNotFound.instance = this;
		
		this.#app = this.getElement('#app');
	}

	getElement(selector) { return document.querySelector(selector); }

	render(html, bindEvents)
	{	
		this.#app.innerHTML = html;
		if (bindEvents) { bindEvents(); }
	}
}

export { ViewsNotFound };