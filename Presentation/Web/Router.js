import UtilsCheckers from "../../Infrastructure/Utils/Checkers.js"

class Router
{
	static getRequiredFields() { return ["controllers", "routes", "app", "toRender"]; }
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
				path: "Components.Home.html",
				initialize: async (html) => await executeController("home", html)
			},
			"/auth":
			{
				path: "Components.Auth.html",
				initialize: async (html) => await executeController("auth", html)
			},
			"*":
			{
				path: "Components.NotFound.html",
				initialize: async (html) => await executeController("notFound", html)
			}
		}
		
		window.addEventListener('popstate', () => this.handleRoute());
		this.#interceptNavClicks();

		this.toRender =
		[
			{ componentPath: "Components.Header.html", initialize: async (html) => await executeController("header", html), priority: 1 },
		];
		this.toRender.sort((a, b) => a.priority - b.priority);

		this.app = document.getElementById("app");
	}

	async navigateTo(path) { this.#findComponent(null, path); await this.handleRoute(); }

	async handleRoute()
	{
		const path = window.location.pathname;
		const routeKey = `/${path.split("/").pop()}`;
		let route = null;
		if (routeKey === "/Components.Index.html") {  route = this.route["/"]; }
		else { route = this.route[routeKey] || this.route["*"]; }
		
		try
		{
			await Promise.all
			(
				this.toRender.map
				(
					async (component) =>
					{
						const componentHtml = await this.#fetchHtml(component.componentPath);
						await component.initialize(componentHtml);
					}
				)
			);

			const pageHtml = await this.#fetchHtml(route.path);
			await route.initialize(pageHtml);
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
					this.#findComponent(event);
					await this.handleRoute();
				}
			}
		)
	}

	#findComponent(event = null, href = null)
	{
		const basePath = "/Presentation/Web/Components";
		if (!href) { href = event.target.getAttribute("href"); }
		const fullPath = basePath + href.replace(basePath, "");
		history.pushState({}, "", fullPath);
	}
}

export { Router };