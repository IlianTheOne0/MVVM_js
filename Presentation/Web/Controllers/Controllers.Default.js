class ControllersDefault
{
	static getRequiredFields() { return ["model", "view", "name"]; }
	static getRequiredMethods() { return ["initialize"]; }
	
	name;

	constructor(model, view, name = "default_controller") { this.model = model; this.view = view; this.name = name; }

	async initialize(html) { this.view.render(html); }
}

export { ControllersDefault };