import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesControllersTickets extends Interfaces
{
	static getRequiredFields() { return ["modelTickets", "modelCart", "view", "name"]; }
	static getRequiredMethods() { return ["initialize"]; }
}

export { InterfacesControllersTickets };