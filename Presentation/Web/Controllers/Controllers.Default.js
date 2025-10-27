class ControllersDefault
{
	static getRequiredFields() { return ["name"]; }
	static getRequiredMethods() { return ["initialize"]; }
	
	name = "default_controller";

	constructor(model, view, name) { this.model = model; this.view = view; this.name = name; }

	async initialize(html) { this.view.render(html); }
}

export { ControllersDefault };