class SourcesLocalStorage
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["initialize", "testConnection", "getItem", "setItem", "removeItem", "clear"]; }

	#storage = null;

	constructor() { this.#storage = window.localStorage; }
	
	async initialize() { if (this.#storage) { return } this.#storage = window.localStorage; }
	async testConnection() { return true; }
	
	async getItem(key) { return this.#storage.getItem(key); }
	async setItem(key, value) { this.#storage.setItem(key, value); return true; }
	async removeItem(key) { this.#storage.removeItem(key); return true; }
	async clear() { this.#storage.clear(); return true; }
}

export { SourcesLocalStorage };