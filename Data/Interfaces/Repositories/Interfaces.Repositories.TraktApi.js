import Interfaces from "../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesRepositoriesTraktApi extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getMovies", "getMoviePrice", "changeMovieStock"]; }
}

export { InterfacesRepositoriesTraktApi };