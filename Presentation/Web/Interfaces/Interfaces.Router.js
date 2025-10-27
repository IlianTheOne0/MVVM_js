import Interfaces from "../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesRouter extends Interfaces
{
	static getRequiredFields() { return ["controllers", "routes", "app"]; }
	static getRequiredMethods() { return ["navigateTo", "handleRoute"]; }
}

export default InterfacesRouter;