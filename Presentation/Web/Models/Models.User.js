class ModelsUser
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["isLoggedIn", "login", "logout"]; }
	
	#service = null;

	#isLoggedIn = false;

	constructor(serviceUser)
	{
		if (ModelsUser.instance) { return ModelsUser.instance; }
		ModelsUser.instance = this;

		this.#service = serviceUser;
	}

	isLoggedIn() { return this.#isLoggedIn; }

	async login(userData) { const result = await this.#service.login(userData); if (result) { this.#isLoggedIn = true; } return this.#isLoggedIn; }
	async logout() { const result = await this.#service.logout(); if (result) { this.#isLoggedIn = false; } return !this.#isLoggedIn; }
	async register(userData) { return await this.#service.register(userData); }

	async getUsername()
	{
		if (!this.#isLoggedIn) { return null; }
		const userData = await this.#service.getUserData();
		return userData ? userData.Username : null;
	}
}

export { ModelsUser };