class ControllersHome
{
	static getRequiredFields() { return ["name"]; }
	static getRequiredMethods() { return ["initialize"]; }
	
	name = "home_controller";

	constructor(modelHome, viewHome)
	{
		if (ControllersHome.instance) { return ControllersHome.instance; }
		ControllersHome.instance = this;

		this.model = modelHome;
		this.view = viewHome;
	}

	async initialize(html) { this.view.render(html); this.view.updateAuthBlock(this.model.isLoggedIn()); }
}

export { ControllersHome };