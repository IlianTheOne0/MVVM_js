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

	#pageControls()
	{
		const previousButton = this.view.getElement('#previous-page-button');
		const nextButton = this.view.getElement('#next-page-button');

		const currentPageP = this.view.getElement('#current-page');

		if (!previousButton || !nextButton) { throw new Error("Pagination buttons not found in the view"); }
		if (!currentPageP) { throw new Error("Current page element not found in the view"); }

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
				currentPage += 1;
				currentPageP.textContent = currentPage;

				this.view.showLoading();
				this.view.hideAllFilms();

				const films = await this.model.getMovies({ page: currentPage, limit: 15 });
				this.view.render(this.view.getElement('#app').innerHTML, this.#bindEvents.bind(this), films);

				this.view.hideLoading();
			}
		);
	}

	#filterControls()
	{
		const applyFiltersButton = this.view.getElement('#apply-filters-button');
		const clearFiltersButton = this.view.getElement('#clear-filters-button');
		
		const filterTitleInput = this.view.getElement('#filter-title');
		const filterDateFromInput = this.view.getElement('#filter-date-from');
		const filterDateToInput = this.view.getElement('#filter-date-to');

		const currentPageP = this.view.getElement('#current-page');

		if (!applyFiltersButton || !clearFiltersButton) { throw new Error("Filter buttons not found in the view"); }
		if (!filterTitleInput || !filterDateFromInput || !filterDateToInput) { throw new Error("Filter inputs not found in the view"); }
		if (!currentPageP) { throw new Error("Current page element not found in the view"); }

		applyFiltersButton.addEventListener
		(
			'click',
			async () =>
			{
				const titleFilter = filterTitleInput.value.trim().toLowerCase();
				const dateFromFilter = filterDateFromInput.value;
				const dateToFilter = filterDateToInput.value;

				this.view.showLoading();
				this.view.hideAllFilms();

				const filters = {};
				if (titleFilter) { filters.title = titleFilter; }
				if (dateFromFilter) { filters.dateFrom = dateFromFilter; }
				if (dateToFilter) { filters.dateTo = dateToFilter; }
				
				const films = await this.model.getMovies({ page: 1, limit: 15 }, filters);

				this.view.render(this.view.getElement('#app').innerHTML, this.#bindEvents.bind(this), films);

				this.view.getElement('#filter-title').value = titleFilter;
				this.view.getElement('#filter-date-from').value = dateFromFilter;
				this.view.getElement('#filter-date-to').value = dateToFilter;

				this.view.hideLoading();
			}
		);

		clearFiltersButton.addEventListener
		(
			'click',
			async () =>
			{
				filterTitleInput.value = '';
				filterDateFromInput.value = '';
				filterDateToInput.value = '';

				currentPageP.textContent = '1';


				this.view.showLoading();
				this.view.hideAllFilms();
				
				const films = await this.model.getMovies({ page: 1, limit: 15 });
				this.view.render(this.view.getElement('#app').innerHTML, this.#bindEvents.bind(this), films);
				
				this.view.hideLoading();
			}
		);
	}

	#bindEvents()
	{
		this.#pageControls();
		this.#filterControls();
	}
}

export { ControllersTickets };