import Interfaces from "../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesRepositoriesCart extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getUserCart", "updateUserCart", "reduceMovieStock", "increaseMovieStock"]; }
}

export { InterfacesRepositoriesCart };