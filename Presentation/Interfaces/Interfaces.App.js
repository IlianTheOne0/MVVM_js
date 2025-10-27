import Interfaces from "../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesApp extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["initializeApp"]; }
}

export default InterfacesApp;