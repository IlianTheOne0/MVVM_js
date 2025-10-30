import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesControllersDefault extends Interfaces
{
	static getRequiredFields() { return ["model", "view", "name"]; }
	static getRequiredMethods() { return ["initialize"]; }
}

export default InterfacesControllersDefault;