class RepositoriesLocalStorage
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["checkUserExistance", "saveUser"]; }

	#source = null;

	constructor(source) { this.#source = source; }

	async #getAllUsers()
	{
		const usersData = await this.#source.getItem('users');
		if (!usersData) { return []; }
		return JSON.parse(usersData);
	}

	async checkUserExistance(username, password)
	{
		const usersData = await this.#getAllUsers();
		if (!usersData || usersData.length === 0) { return false; }

		const user = usersData.find(user => user.username === username && user.password === password);
		return !!user;
	}

	async saveUser(userData)
	{
		const serversUserData = await this.getAllUsers();
		const userExists = serversUserData.some(user => user.email === userData.email);
		if (userExists) { return false; }

		if (!userData.username || userData.username.trim() == "") { return false; }
		if (!userData.email || userData.email.trim() == "") { return false; }
		if (!userData.password || userData.password.trim() == "") { return false; }
		
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) { return false; }

		if (userData.password.length < 6 || !/[a-z]/.test(userData.password) || !/[A-Z]/.test(userData.password) || !/[0-9]/.test(userData.password)) { return false; }

		const users = await this.#source.getItem('users') ? JSON.parse(await this.#source.getItem('users')) : [];
		users.push(userData);
		await this.#source.setItem('users', JSON.stringify(users));

		return true;
	}
}

export { RepositoriesLocalStorage };