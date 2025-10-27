import Interfaces from "../../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesModelsUser extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["isLoggedIn", "login", "logout"]; }
}

export { InterfacesModelsUser };