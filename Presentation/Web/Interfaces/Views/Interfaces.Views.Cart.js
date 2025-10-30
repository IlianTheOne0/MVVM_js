import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesViewsCart extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "getElements", "render", "countSummary"]; }
}

export { InterfacesViewsCart};