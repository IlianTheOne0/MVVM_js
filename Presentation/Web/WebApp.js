import UtilsCheckers from "../../Infrastructure/Utils/Checkers.js";




import InterfacesRouter from "./Interfaces/Interfaces.Router.js";

import InterfacesDataSourcesApi from "../../Data/Interfaces/Interfaces.Sources.Api.js";

import InterfacesRepositoriesApi from "../../Data/Interfaces/Repositories/Interfaces.Repositories.LocalSorage.js";

import { InterfacesServicesUser } from "../../Domain/Interfaces/Services/Interfaces.Services.User.js";

import InterfacesViews from "./Interfaces/Views/Interfaces.Views.js";
import { InterfacesViewsHeader } from "./Interfaces/Views/Interfaces.Views.Header.js"
import { InterfacesViewsHome } from "./Interfaces/Views/Interfaces.Views.Home.js"

import InterfacesControllers from "./Interfaces/Controllers/Interfaces.Controllers.js";

import { InterfacesModelsUser } from "./Interfaces/Models/Interfaces.Models.User.js";




import { SourcesLocalStorage } from "../../Data/DataSources/Sources.LocalStorage.js"




import { RepositoriesLocalStorage } from "../../Data/Repositories/Repositories.LocalSorage.js";




import { ServicesUser } from "../../Domain/Services/Services.User.js";




import { ModelsUser } from "./Models/Models.User.js";




import { ViewsDefault } from "./Views/Views.Default.js";
import { ViewsHeader } from "./Views/Views.Header.js";
import { ViewsHome } from "./Views/Views.Home.js";




import { ControllersDefault } from "./Controllers/Controllers.Default.js"
import { ControllersHeader } from "./Controllers/Controllers.Header.js";
import { ControllersNotFound } from "./Controllers/Controllers.NotFound.js";
import { ControllersHome } from "./Controllers/Controllers.Home.js";
import { ControllersAuth } from "./Controllers/Controllers.Auth.js";




import { Router } from "./Router.js";




class WebApp
{
	#sources = null;
	#repositories = null;
	#services = null;
	#models = null;
	#views = null;
	#controllers = null;
	
	#router = null;

	static getRequiredFields() { return null; }
	static getRequiredMethods() { return ["initializeApp"]; }

	#initializeSources()
	{
		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }

		check(SourcesLocalStorage, InterfacesDataSourcesApi);
		const sourceLocalStorage = new SourcesLocalStorage();

		const sources =
		{
			localStorage: sourceLocalStorage
		};

		return sources;
	}

	#initializeRepositories()
	{
		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }

		check(RepositoriesLocalStorage, InterfacesRepositoriesApi);
		const repositoryLocalStorage = new RepositoriesLocalStorage(this.#sources.localStorage);

		const repositories =
		{
			localStorage: repositoryLocalStorage
		};

		return repositories;
	}

	#initializeServices()
	{
		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }

		check(ServicesUser, InterfacesServicesUser);
		const serviceUser = new ServicesUser(this.#repositories.localStorage);

		const services =
		{
			user: serviceUser
		};

		return services;
	}
	
	#initializeModels()
	{
		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }

		check(ModelsUser, InterfacesModelsUser);
		const ModelUser = new ModelsUser(this.#services.user);

		const models =
		{
			user: ModelUser
		};

		return models;
	}

	#initializeViews()
	{
		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }

		check(ViewsDefault, InterfacesViews);
		const ViewDefault = new ViewsDefault();

		check(ViewsHeader, InterfacesViewsHeader);
		const ViewHeader = new ViewsHeader();

		check(ViewsHome, InterfacesViewsHome);
		const ViewHome = new ViewsHome();
		
		const views =
		{
			default: ViewDefault,
			header: ViewHeader,
			home: ViewHome
		};

		return views;
	}

	#initializeControllers()
	{
		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }
		
		check(ControllersDefault, InterfacesControllers);
		const ControllerDefault = new ControllersDefault(this.#models.user, this.#views.default);

		check(ControllersHeader, InterfacesControllers);
		const ControllerHeader = new ControllersHeader(this.#models.user, this.#views.header);

		check(ControllersNotFound, InterfacesControllers);
		const ControllerNotFound = new ControllersNotFound(null, this.#views.default);
		
		check(ControllersHome, InterfacesControllers);
		const ControllerHome = new ControllersHome(this.#models.user, this.#views.home);

		check(ControllersAuth, InterfacesControllers);
		const ControllerAuth = new ControllersAuth(this.#models.user, this.#views.default);

		const controllers =
		{
			default: ControllerDefault,
			header: ControllerHeader,
			notFound: ControllerNotFound,
			home: ControllerHome,
			auth: ControllerAuth
		};

		return controllers;
	}

	#initializeRouter()
	{
		UtilsCheckers.checkInstance(Router, InterfacesRouter);
		const router = new Router
		(
			[
				this.#controllers.header,
				this.#controllers.notFound,
				this.#controllers.home,
				this.#controllers.auth
			]
		);

		return router;
	}

	async initializeApp()
	{
		this.#sources = this.#initializeSources();
		this.#repositories = this.#initializeRepositories();
		this.#services = this.#initializeServices();
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