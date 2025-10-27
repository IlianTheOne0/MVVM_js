class ModelsNotFound
{
	constructor()
	{
		if (ModelsNotFound.instance) { return ModelsNotFound.instance; }
		ModelsNotFound.instance = this;
	}
}

export { ModelsNotFound };