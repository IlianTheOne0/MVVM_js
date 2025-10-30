class ViewsTickets
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "getElements", "render", "hideAllFilms", "showLoading", "hideLoading", "addSubscriber"]; }

	#app = null;
	#subscribers = null;

	constructor()
	{
		if (ViewsTickets.instance) { return ViewsTickets.instance; }
		ViewsTickets.instance = this;

		this.#app = this.getElement('#app');
		this.#subscribers = [];
	}

	getElement(selector) { return document.querySelector(selector); }
	getElements(selector) { return document.querySelectorAll(selector); }

	render(html, bindEvents = null, films = [])
	{ 
		this.#app.innerHTML = html;
		if (bindEvents) { bindEvents(); }

		this.#addFilms(films);
		this.#notifySubscribers();
	}

	#addFilms(films)
	{
		const filmsContainer = this.getElement('.films-container');
		if (!filmsContainer) { return; }
		
		filmsContainer.innerHTML = '';

		for (const film of films)
		{
			const filmCard = document.createElement('div');
			filmCard.classList.add('film-card');

			filmCard.innerHTML =
			`
				<img src="" alt="${film.title} Poster">
				<h3 id="film-card_title">${film.title}</h3>
				<p id="film-card_date">${film.date}</p>
				<p id="film-card_available-seats">Available Seats: ${film.seatsAvailable}</p>
				<div class="booking">
					<label for="seat-selection-${film.id}">Number of seats
						<input id="seat-selection-${film.id}" type="number" value="1" min="1" max="10"/>
					</label>
					<button data-item-id="${film.id}" id="book-ticket-button">Book</button>
				</div>
			`;
			
			const imgElement = filmCard.querySelector('img');
			if (film.poster) { const objectUrl = URL.createObjectURL(film.poster); imgElement.src = objectUrl; imgElement.onload = () => { URL.revokeObjectURL(objectUrl); }; }
			else { imgElement.src = 'https://github.com/IlianTheOne0/MVVM_js/blob/hm/task/Presentation/Assets/Posters/default-poster.jpg?raw=true'; }

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

	#notifySubscribers()
	{
		for (const subscriber of this.#subscribers) { subscriber(); }
	}

	addSubscriber(subscriber) { this.#subscribers.push(subscriber); }
}

export { ViewsTickets };