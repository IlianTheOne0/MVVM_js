import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesModelsTickets extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getMovies", "getMoviePoster"]; }
}

export { InterfacesModelsTickets };