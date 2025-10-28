import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesViewsTickets extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "render", "hideAllFilms", "showLoading", "hideLoading"]; }
}

export { InterfacesViewsTickets };