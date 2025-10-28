import Interfaces from "../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesDataSourcesTraktApi extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["initialize", "testConnection", "getTrendingMovies"]; }
}

export { InterfacesDataSourcesTraktApi };