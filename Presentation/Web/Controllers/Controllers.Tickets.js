class ControllersTickets
{
	static getRequiredFields() { return ["name"]; }
	static getRequiredMethods() { return ["initialize"]; }
	
	name = "tickets_controller";

	constructor(model, view)
	{
		if (ControllersTickets.instance) { return ControllersTickets.instance; }
		ControllersTickets.instance = this;

		this.model = model;
		this.view = view;
	}

	async initialize(html)
	{
		const films = await this.model.getMovies({ page: this.view.getElement('#current-page') || 1, limit: 15 });
		this.view.render(html, this.#bindEvents.bind(this), films);
	}

	#bindEvents()
	{
		const previousButton = this.view.getElement('#previous-page-button');
		const nextButton = this.view.getElement('#next-page-button');

		const currentPageP = this.view.getElement('#current-page');

		previousButton.addEventListener
		(
			'click',
			async () =>
			{
				let currentPage = parseInt(currentPageP.textContent);
				if (currentPage > 1) { currentPage -= 1; }
				currentPageP.textContent = currentPage;

				this.view.showLoading();
				this.view.hideAllFilms();
				const films = await this.model.getMovies({ page: currentPage, limit: 15 });
				this.view.render(this.view.getElement('#app').innerHTML, this.#bindEvents.bind(this), films);
				this.view.hideLoading();
			}
		);
		nextButton.addEventListener
		(
			'click',
			async () =>
			{
				let currentPage = parseInt(currentPageP.textContent);
				if (currentPage < 3) { currentPage += 1; }
				currentPageP.textContent = currentPage;

				this.view.showLoading();
				this.view.hideAllFilms();
				const films = await this.model.getMovies({ page: currentPage, limit: 15 });
				this.view.render(this.view.getElement('#app').innerHTML, this.#bindEvents.bind(this), films);
				this.view.hideLoading();
			}
		);
	}
}

export { ControllersTickets };