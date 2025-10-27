class ControllersHeader
{
	static getRequiredFields() { return ["name"]; }
	static getRequiredMethods() { return ["initialize"]; }
	
	name = "header_controller";

	constructor(modelHeader, viewHeader)
	{
		if (ControllersHeader.instance) { return ControllersHeader.instance; }
		ControllersHeader.instance = this;

		this.model = modelHeader;
		this.view = viewHeader;
	}

	async initialize(html) { this.view.render(html); this.view.updateAuthBlock(this.model.isLoggedIn()); }
}

export { ControllersHeader };