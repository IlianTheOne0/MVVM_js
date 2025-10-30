import InterfacesServices from "../../Infrastructure/Interfaces/Interfaces.Services.js";

class ServicesUser extends InterfacesServices
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["isLoggedIn", "login", "logout"]; }

	#currentUser = null;

	constructor(repositoryLocalStorage)
	{
		super();
		
		if (ServicesUser.instance) { return ServicesUser.instance; }
		ServicesUser.instance = this;

		this.repositoryLocalStorage = repositoryLocalStorage;
	}

	isLoggedIn() { if (this.#currentUser) { return true; } return false; }

	async login(userData)
	{
		const { username, password } = userData;

		if (!username || username.trim() == "") { alert("Username is required."); return; }
		if (!password || password.trim() == "") { alert("Password is required."); return; }

		if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) { alert("Password must be at least 6 characters long and contain a mix of uppercase, lowercase, and numeric characters."); return; }

		const userExistance = await this.repositoryLocalStorage.checkUserExistance(username, password);
		if (userExistance) { this.#currentUser = { Username: username }; return true; }

		return false;
	}
	async logout()
	{
		if (this.#currentUser) { this.#currentUser = null; return true; }
		return false;
	}
	async register(userData) { return await this.repositoryLocalStorage.saveUser(userData); }

	async getUserData() { return this.#currentUser; }
}

export { ServicesUser };