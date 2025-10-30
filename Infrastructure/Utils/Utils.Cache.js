import UtilsCheckers from "./Utils.Checkers.js";

import InterfacesRepositories from "../Interfaces/Interfaces.Repositories.js";
import InterfacesServices from "../Interfaces/Interfaces.Services.js";

class UtilsCache
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["setPermanent", "set", "has", "get", "clear", "size"]; }

	#map;

	constructor(instance, timeToLive = 6 * 100)
	{
		this.#map = new Map(); this.timeToLive = timeToLive;

		if (UtilsCheckers.checkInstance(instance, InterfacesRepositories)) { return UtilsCache.repositoryInstance ? UtilsCache.repositoryInstance : UtilsCache.repositoryInstance = this; }
		if (UtilsCheckers.checkInstance(instance, InterfacesServices)) { return UtilsCache.serviceInstance ? UtilsCache.serviceInstance : UtilsCache.serviceInstance = this; }
	}

	#set(key, value, timeToLive = null)
	{
		const now = Date.now();
		const timeToLiveInSeconds = timeToLive || this.timeToLive;
		const expire = (timeToLiveInSeconds === Infinity) ? Infinity : now + (timeToLiveInSeconds * 1000);
		this.#map.set(key, { value, expire });
	}
	#get(key)
	{
		const entry = this.#map.get(key);
		if (!entry) { return null; }
		if (Date.now() > entry.expire) { this.#map.delete(key); return null; }
		return entry.value;
	}

	setPermanent(key, value) { this.#set(key, value, Infinity); }
	set(key, value, timeToLive = null) { this.#set(key, value, timeToLive); }
	has(key) { return this.#get(key) !== null; }
	get(key) { return this.#get(key); }
	clear() { this.#map.clear(); }

	size() { return this.#map.size; }
}

export { UtilsCache };