class ModelsUser
{
	static getRequiredFields() { return ["serviceUser"]; }
	static getRequiredMethods() { return ["isLoggedIn", "login", "logout"]; }
	
	#isLoggedIn = false;

	constructor(serviceUser)
	{
		if (ModelsUser.instance) { return ModelsUser.instance; }
		ModelsUser.instance = this;

		this.serviceUser = serviceUser;
	}

	isLoggedIn() { return this.#isLoggedIn; }

	async login(userData) { const result = await this.serviceUser.login(userData); if (result) { this.#isLoggedIn = true; } return this.#isLoggedIn; }
	async logout() { const result = await this.serviceUser.logout(); if (result) { this.#isLoggedIn = false; } return !this.#isLoggedIn; }
	async register(userData) { return await this.serviceUser.register(userData); }

	async getUsername()
	{
		if (!this.#isLoggedIn) { return null; }
		
		const userData = await this.serviceUser.getUserData();
		return userData ? userData.Username : null;
	}
}

export { ModelsUser };