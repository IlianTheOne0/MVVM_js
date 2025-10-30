import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesModelsCart extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getUserCart", "updateUserCart"]; }
}

export { InterfacesModelsCart };