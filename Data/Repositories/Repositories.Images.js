import InterfacesRepositories from "../../Infrastructure/Interfaces/Interfaces.Repositories.js";

class RepositoriesImages extends InterfacesRepositories
{
	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["getImage"]; }

	#cache = null;

	constructor(cache)
	{
		super();
		
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
			if (!imageUrl) { return null; }

			const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
			const absoluteUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://') ? `${proxyUrl}${imageUrl}` : `${proxyUrl}https://${imageUrl}`;
			const response = await fetch(absoluteUrl);
			if (!response.ok) { console.error(`Failed to fetch image from ${imageUrl}`); return null; }
			
			const image = await response.blob();
			this.#cache.setPermanent(imageUrl, image);
			
			return image;
		}
		catch (error) { throw error; }
	}
}

export { RepositoriesImages };