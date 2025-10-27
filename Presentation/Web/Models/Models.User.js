class ModelsUser
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["isLoggedIn", "login", "logout"]; }
	
	#isLoggedIn = false;

	constructor()
	{
		if (ModelsUser.instance) { return ModelsUser.instance; }
		ModelsUser.instance = this;
	}

	isLoggedIn() { return this.#isLoggedIn; }
	login() { this.#isLoggedIn = true; }
	logout() { this.#isLoggedIn = false; }
}

export { ModelsUser };