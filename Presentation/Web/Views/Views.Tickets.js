class ViewsTickets
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "render", "hideAllFilms", "showLoading", "hideLoading"]; }

	#app = null;

	constructor() { this.#app = this.getElement('#app'); }

	getElement(selector) { return document.querySelector(selector); }
	render(html, bindEvents = null, films = [])
	{ 
		this.#app.innerHTML = html;
		if (bindEvents) { bindEvents(); }
		this.#addFilms(films);
	}

	#addFilms(films)
	{
		const filmsContainer = this.getElement('.films-container');
		if (!filmsContainer) { return; }

		for (const film of films)
		{
			const filmCard = document.createElement('div');
			filmCard.classList.add('film-card');
			filmCard.innerHTML =
			`
				<img src="" alt="${film.title} Poster">
				<h3 id="film-card_title">${film.title}</h3>
				<p id="film-card_date">${film.year}</p>
				<p id="film-card_available-seats">Available Seats: ${film.seatsAvailable}</p>
				<label for="seat-selection">Number of seats:<input id="seat-selection" type="number" value="1" min="1"/></label>
				<button id="book-ticket-btn">Book</button>
			`;
			const imgElement = filmCard.querySelector('img');
			const objectUrl = URL.createObjectURL(film.poster);
			imgElement.src = objectUrl;
			imgElement.onload = () => { URL.revokeObjectURL(objectUrl); };

			filmsContainer.appendChild(filmCard);
		}
	}

	hideAllFilms()
	{
		const filmsContainer = this.getElement('.films-container');
		if (filmsContainer) { filmsContainer.innerHTML = ''; }
	}

	showLoading()
	{
		const loadingElement = this.getElement('.loading');
		if (loadingElement) { loadingElement.classList.remove('hidden'); }
	}

	hideLoading()
	{
		const loadingElement = this.getElement('.loading');
		if (loadingElement) { loadingElement.classList.add('hidden'); }
	}
}

export { ViewsTickets };