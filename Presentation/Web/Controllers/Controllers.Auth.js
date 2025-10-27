class ControllersAuth
{
	static getRequiredFields() { return ["name"]; }
	static getRequiredMethods() { return ["initialize"]; }
	
	name = "auth_controller";

	constructor(modelAuth, viewAuth)
	{
		if (ControllersAuth.instance) { return ControllersAuth.instance; }
		ControllersAuth.instance = this;

		this.model = modelAuth;
		this.view = viewAuth;
	}

	async initialize(html) { this.view.render(html); }
}

export { ControllersAuth };