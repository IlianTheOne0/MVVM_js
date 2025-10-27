import UtilsCheckers from "../../Infrastructure/Utils/Checkers.js"

class Router
{
	static getRequiredFields() { return ["controllers", "routes", "app"]; }
	static getRequiredMethods() { return ["navigateTo", "handleRoute"]; }

	constructor(controllers)
	{
		if (Router.instance) { return Router.instance; }
		Router.instance = this;

		UtilsCheckers.checkArgument(controllers, "object");
		
		const executeController = async (controllerName, html) =>
		{
			const controller = this.controllers.find(controller => controller.name.includes(controllerName));
			if (controller) { await controller.initialize(html); }
			else { await this.route["*"].initialize(await this.#fetchHtml(this.route["*"].path)); }
		}

		this.controllers = controllers;

		this.route = 
		{
			"/":
			{
				path: "Pages.Home.html",
				initialize: async (html) => await executeController("home", html)
			},
			"/tickets":
			{
				path: "Pages.Tickets.html",
				initialize: async (html) => await executeController("tickets", html)
			},
			"/profile":
			{
				path: "Pages.Profile.html",
				initialize: async (html) => await executeController("profile", html)
			},
			"*":
			{
				path: "Pages.NotFound.html",
				initialize: async (html) => await executeController("notFound", html)
			}
		}
		
		window.addEventListener('popstate', () => this.handleRoute());
		this.#interceptNavClicks();

		this.app = document.getElementById("app");
	}

	async navigateTo(path) { this.#findPage(null, path); await this.handleRoute(); }

	async handleRoute()
	{
		const path = window.location.pathname;
		const routeKey = `/${path.split("/").pop()}`;
		let route = null;
		if (routeKey === "/Pages.Index.html") {  route = this.route["/"]; }
		else { route = this.route[routeKey] || this.route["*"]; }
		
		try
		{
			const html = await this.#fetchHtml(route.path);
			await route.initialize(html);
		}
		catch (error)
		{
			console.error("Router error:", error);
			try
			{
				const notFound = this.route["*"];
				const html = await this.#fetchHtml(notFound.path);
				await notFound.initialize(html);
			}
			catch (nestedError)
			{
				console.error("Router nested error:", nestedError);
				this.app.innerHTML = "<h1>Critical Error: Unable to load page</h1>";
			}
		}
	}

	async #fetchHtml(path)
	{
		UtilsCheckers.checkArgument(path, "string");

		let response = null;
		try
		{
			response = await fetch(path);
			if (!response.ok) { throw new Error(`Failed to load page: ${path}`); }
		}
		catch (error) { console.error("Fetch error:", error); throw error; }

		return response.text();
	}

	#interceptNavClicks()
	{
		document.body.addEventListener
		(
			"click",
			async (event) =>
			{
				if (event.target.matches("a"))
				{
					event.preventDefault();
					this.#findPage(event);
					await this.handleRoute();
				}
			}
		)
	}

	#findPage(event = null, href = null)
	{
		const basePath = "/Presentation/Web/Pages";
		if (!href) { href = event.target.getAttribute("href"); }
		const fullPath = basePath + href.replace(basePath, "");
		history.pushState({}, "", fullPath);
	}
}

export { Router };