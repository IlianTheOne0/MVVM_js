import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesServicesTickets extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getMovies"]; }
}

export { InterfacesServicesTickets };