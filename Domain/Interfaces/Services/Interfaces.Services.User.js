import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesServicesUser extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["isLoggedIn", "login", "logout"]; }
}

export { InterfacesServicesUser };