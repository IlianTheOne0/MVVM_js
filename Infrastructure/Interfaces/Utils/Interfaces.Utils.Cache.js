import Interfaces from "../Interfaces.js";

class InterfacesUtilsCache extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["set", "has", "get", "clear", "size"]; }
}
	
export default InterfacesUtilsCache;