import Interfaces from "../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesControllers extends Interfaces
{
	static getRequiredFields() { return ["name"]; }
	static getRequiredMethods() { return ["initialize"]; }
}

export default InterfacesControllers;