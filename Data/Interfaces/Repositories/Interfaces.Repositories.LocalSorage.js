import Interfaces from "../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesRepositoriesApi extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["checkUserExistance", "saveUser"]; }
}

export default InterfacesRepositoriesApi;