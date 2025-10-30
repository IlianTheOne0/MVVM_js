import InterfacesRepositories from "../../Infrastructure/Interfaces/Interfaces.Repositories.js";

class RepositoriesLocalStorage extends InterfacesRepositories
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["checkUserExistance", "saveUser", "getUserData", "updateUserData"]; }

	#source = null;
	#cache = null;

	constructor(source, cache)
	{
		super();

		if (RepositoriesLocalStorage.instance) { return RepositoriesLocalStorage.instance; }
		RepositoriesLocalStorage.instance = this;

		this.#source = source;
		this.#cache = cache;
	}

	async #getAllUsers()
	{
		const hashKey = 'all_users';
		const cachedUsers = this.#cache.get(hashKey);
		if (cachedUsers) { return cachedUsers; }

		const usersData = await this.#source.getItem('users');
		if (!usersData) { return []; }

		const parsedUsers = JSON.parse(usersData);
		this.#cache.set(hashKey, parsedUsers);
		return parsedUsers;
	}

	async checkUserExistance(username, password = null, email = null)
	{
		const cachedUsers = this.#cache.get('all_users');
		const usersData = cachedUsers || await this.#getAllUsers();
		if (!usersData || usersData.length === 0) { return false; }
		
		const user = usersData.find(user => user.username === username && (password === null || user.password === password) && (email === null || user.email === email));
		return !!user;
	}

	async saveUser(userData)
	{
		const cachedUsers = this.#cache.get('all_users');
		const userExists = await this.checkUserExistance(userData.username, userData.password, userData.email) || (cachedUsers ? cachedUsers.some(user => user.username === userData.username || user.email === userData.email) : false);
		if (userExists) { return false; }

		if (!userData.username || userData.username.trim() == "") { return false; }
		if (!userData.email || userData.email.trim() == "") { return false; }
		if (!userData.password || userData.password.trim() == "") { return false; }
		
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) { return false; }

		if (userData.password.length < 6 || !/[a-z]/.test(userData.password) || !/[A-Z]/.test(userData.password) || !/[0-9]/.test(userData.password)) { return false; }

		const users = await this.#source.getItem('users') ? JSON.parse(await this.#source.getItem('users')) : [];
		users.push({ ...userData, cart: [] });
		await this.#source.setItem('users', JSON.stringify(users));

		this.#cache.set('all_users', users);
		this.#cache.set(`user_${userData.username}`, { ...userData, cart: [] });

		return true;
	}

	async getUserData(username)
	{
		const cachedUser = this.#cache.get(`user_${username}`);
		if (cachedUser) { return cachedUser; }

		this.checkUserExistance(username);

		const usersData = await this.#getAllUsers();
		if (!usersData || usersData.length === 0) { return null; }

		const user = usersData.find(user => user.username === username);
		return user ? user : null;
	}

	async updateUserData(username, newUserData)
	{
		this.checkUserExistance(username);
		
		const usersData = await this.#getAllUsers();
		if (!usersData || usersData.length === 0) { return false; }

		const userIndex = usersData.findIndex(user => user.username === username);
		if (userIndex === -1) { return false; }

		usersData[userIndex] = { ...usersData[userIndex], ...newUserData };
		await this.#source.setItem('users', JSON.stringify(usersData));

		this.#cache.set('all_users', usersData);
		this.#cache.set(`user_${username}`, usersData[userIndex]);
		return true;
	}
}

export { RepositoriesLocalStorage };