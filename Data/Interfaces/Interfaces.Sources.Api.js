import Interfaces from "../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesDataSourcesApi extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["initialize", "testConnection"]; }
}

export default InterfacesDataSourcesApi;