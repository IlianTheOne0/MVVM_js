class UtilsCache
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["set", "has", "get", "clear", "size"]; }

	#map;

	constructor(timeToLive = 6 * 1000)
	{
		if (UtilsCache.instance) { return UtilsCache.instance; }
		UtilsCache.instance = this;

		this.#map = new Map();
		this.timeToLive = timeToLive;
	}

	#set(key, value)
	{
		const now = Date.now();
		const expire = now + this.timeToLive * 1000;
		this.#map.set(key, { value, expire });
	}
	#get(key)
	{
		const entry = this.#map.get(key);
		if (!entry) { return null; }
		if (Date.now() > entry.expire) { this.#map.delete(key); return null; }
		return entry.value;
	}

	set(key, value) { this.#set(key, value); }
	has(key) { return this.#get(key) !== null; }
	get(key) { return this.#get(key); }
	clear() { this.#map.clear(); }

	size() { return this.#map.size; }
}

export default UtilsCache;