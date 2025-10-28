class RepositoriesImages
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getImage"]; }

	#cache = null;

	constructor(cache)
	{
		if (RepositoriesImages.instance) { return RepositoriesImages.instance; }
		RepositoriesImages.instance = this;

		this.#cache = cache;
	}

	async getImage(imageUrl)
	{
		const cachedImage = this.#cache.get(imageUrl);
		if (cachedImage) { return cachedImage; }

		try
		{
			const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
			const absoluteUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://') ? `${proxyUrl}${imageUrl}` : `${proxyUrl}https://${imageUrl}`;
			const response = await fetch(absoluteUrl);
			if (!response.ok) { throw new Error(`Failed to fetch image from ${imageUrl}`); }
			
			const image = await response.blob();
			this.#cache.setPermanent(imageUrl, image);
			
			return image;
		}
		catch (error) { throw error; }
	}
}

export { RepositoriesImages };