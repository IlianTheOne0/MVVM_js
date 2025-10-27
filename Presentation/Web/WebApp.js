import UtilsCheckers from "../../Infrastructure/Utils/Checkers.js";

import InterfacesRouter from "./Interfaces/Interfaces.Router.js"
import InterfacesViews from "./Interfaces/Interfaces.Views.js";
import InterfacesControllers from "./Interfaces/Interfaces.Controllers.js";

import { ModelsNotFound } from "./Models/Models.NotFound.js";

import { ViewsNotFound } from "./Views/View.NotFound.js";

import { ControllersNotFound } from "./Controllers/Controllers.NotFound.js";

import { Router } from "./Router.js";

class WebApp
{
	#models = null;
	#views = null;
	#controllers = null;
	
	#router = null;

	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["initializeApp"]; }

	#initializeModels()
	{		
		const models =
		{
			notFound: new ModelsNotFound()
		};

		return models;
	}

	#initializeViews()
	{
		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }

		check(ViewsNotFound, InterfacesViews);
		const ViewNotFound = new ViewsNotFound();
		
		const views =
		{
			notFound: ViewNotFound
		};

		return views;
	}

	#initializeControllers()
	{
		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }

		check(ControllersNotFound, InterfacesControllers);
		const ControllerNotFound = new ControllersNotFound(this.#models.notFound, this.#views.notFound);

		const controllers =
		{
			notFound: ControllerNotFound
		};

		return controllers;
	}

	#initializeRouter()
	{
		UtilsCheckers.checkInstance(Router, InterfacesRouter);
		const router = new Router
		(
			[
				this.#controllers.notFound
			]
		);

		return router;
	}

	async initializeApp()
	{
		this.#models = this.#initializeModels();
		this.#views = this.#initializeViews();
		this.#controllers = this.#initializeControllers();
		this.#router = this.#initializeRouter();

		await this.#router.handleRoute();
	}
}

const webApp = new WebApp();
await webApp.initializeApp();

export default WebApp;