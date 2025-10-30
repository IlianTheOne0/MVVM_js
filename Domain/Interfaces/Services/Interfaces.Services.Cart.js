import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesServicesCart extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getUserCart", "addToUserCart", "removeFromUserCart"]; }
}

export { InterfacesServicesCart };