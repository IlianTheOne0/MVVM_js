import Interfaces from "../../../Infrastructure/Interfaces/Interfaces.js";

class InterfacesRepositoriesSeats extends Interfaces
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getAvailableSeats", "setAvailableSeats"]; }
}

export { InterfacesRepositoriesSeats };