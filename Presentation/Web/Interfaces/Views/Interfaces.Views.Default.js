import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesViewsDefault extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "render"]; }
}

export default InterfacesViewsDefault;