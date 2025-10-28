import Interfaces from "../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesDataSourcesLocalStorage extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["initialize", "testConnection", "getItem", "setItem", "removeItem", "clear"]; }
}

export { InterfacesDataSourcesLocalStorage };