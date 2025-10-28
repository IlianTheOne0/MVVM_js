import Interfaces from "../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesRepositoriesImages extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getImage"]; }
}

export { InterfacesRepositoriesImages };