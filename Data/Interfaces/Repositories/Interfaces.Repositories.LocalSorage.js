import Interfaces from "../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesRepositoriesLocalStorage extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["checkUserExistance", "saveUser"]; }
}

export { InterfacesRepositoriesLocalStorage };