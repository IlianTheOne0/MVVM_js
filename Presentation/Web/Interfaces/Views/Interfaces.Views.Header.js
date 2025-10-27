import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesViewsHeader extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getElement", "render", "updateAuthBlock"]; }
}

export { InterfacesViewsHeader };