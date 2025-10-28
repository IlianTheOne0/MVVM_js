import config from "./.env/config.js";




import UtilsCheckers from "../../Infrastructure/Utils/Utils.Checkers.js";
import { UtilsCache } from "../../Infrastructure/Utils/Utils.Cache.js"



import InterfacesRouter from "./Interfaces/Interfaces.Router.js";

import { InterfacesDataSourcesLocalStorage } from "../../Data/Interfaces/DataSources/Interfaces.DataSources.LocalStorage.js";
import { InterfacesDataSourcesTraktApi } from "../../Data/Interfaces/DataSources/Interfaces.DataSources.TraktApi.js";

import { InterfacesRepositoriesLocalStorage } from "../../Data/Interfaces/Repositories/Interfaces.Repositories.LocalSorage.js";
import { InterfacesRepositoriesTraktApi } from "../../Data/Interfaces/Repositories/Interfaces.Repositories.TraktApi.js";
import { InterfacesRepositoriesImages } from "../../Data/Interfaces/Repositories/Interfaces.Repositories.Images.js";
import { InterfacesRepositoriesSeats } from "../../Data/Interfaces/Repositories/Interfaces.Repositories.Seats.js";

import { InterfacesServicesUser } from "../../Domain/Interfaces/Services/Interfaces.Services.User.js";
import { InterfacesServicesTickets } from "../../Domain/Interfaces/Services/Interfaces.Services.Tickets.js";

import InterfacesViews from "./Interfaces/Views/Interfaces.Views.js";
import { InterfacesViewsHeader } from "./Interfaces/Views/Interfaces.Views.Header.js"
import { InterfacesViewsHome } from "./Interfaces/Views/Interfaces.Views.Home.js"
import { InterfacesViewsTickets } from "./Interfaces/Views/Interfaces.Views.Ticekts.js";

import InterfacesControllers from "./Interfaces/Controllers/Interfaces.Controllers.js";

import { InterfacesModelsUser } from "./Interfaces/Models/Interfaces.Models.User.js";
import { InterfacesModelsTickets } from "./Interfaces/Models/Interfaces.Models.Tickets.js";




import { SourcesLocalStorage } from "../../Data/DataSources/Sources.LocalStorage.js"
import { SourcesTraktApi } from "../../Data/DataSources/Sources.TraktApi.js";




import { RepositoriesLocalStorage } from "../../Data/Repositories/Repositories.LocalSorage.js";
import { RepositoriesTraktApi } from "../../Data/Repositories/Repositories.TraktApi.js";
import { RepositoriesImages } from "../../Data/Repositories/Repositories.Images.js";
import { RepositoriesSeats } from "../../Data/Repositories/Repositories.Seats.js";




import { ServicesUser } from "../../Domain/Services/Services.User.js";
import { ServicesTickets } from "../../Domain/Services/Services.Tickets.js";




import { ModelsUser } from "./Models/Models.User.js";
import { ModelsTickets } from "./Models/Models.Tickets.js";




import { ViewsDefault } from "./Views/Views.Default.js";
import { ViewsHeader } from "./Views/Views.Header.js";
import { ViewsHome } from "./Views/Views.Home.js";
import { ViewsAuth } from "./Views/Views.Auth.js";
import { ViewsTickets } from "./Views/Views.Tickets.js";


import { ControllersDefault } from "./Controllers/Controllers.Default.js"
import { ControllersHeader } from "./Controllers/Controllers.Header.js";
import { ControllersNotFound } from "./Controllers/Controllers.NotFound.js";
import { ControllersHome } from "./Controllers/Controllers.Home.js";
import { ControllersAuth } from "./Controllers/Controllers.Auth.js";
import { ControllersTickets } from "./Controllers/Controllers.Tickets.js";



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

	async #initializeSources()
	{
		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }

		var sourceLocalStorage = null;
		var sourceTraktApi = null;

		try
		{
			check(SourcesLocalStorage, InterfacesDataSourcesLocalStorage);
			sourceLocalStorage = new SourcesLocalStorage();
		}
		catch (error) { throw new Error("Failed to initialize Local Storage source:", error); }
		
		try
		{
			check(SourcesTraktApi, InterfacesDataSourcesTraktApi);
			sourceTraktApi = new SourcesTraktApi(config.keys.moviesAPIKey);
			await sourceTraktApi.initialize();
			if (!await sourceTraktApi.testConnection()) { throw new Error("Failed to connect to Trakt API source."); }
		}
		catch (error) { throw new Error("Failed to initialize Trakt API source:", error); }

		const sources =
		{
			localStorage: sourceLocalStorage,
			traktApi: sourceTraktApi
		};

		return sources;
	}

	#initializeRepositories()
	{
		const cache = new UtilsCache();

		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }

		check(RepositoriesLocalStorage, InterfacesRepositoriesLocalStorage);
		const repositoryLocalStorage = new RepositoriesLocalStorage(this.#sources.localStorage);

		check(RepositoriesImages, InterfacesRepositoriesImages);
		const repositoryImages = new RepositoriesImages(cache);

		check(RepositoriesSeats, InterfacesRepositoriesSeats);
		const repositorySeats = new RepositoriesSeats();

		check(RepositoriesTraktApi, InterfacesRepositoriesTraktApi);
		const repositoryTraktApi = new RepositoriesTraktApi(this.#sources.traktApi, cache, repositoryImages, repositorySeats);

		const repositories =
		{
			localStorage: repositoryLocalStorage,
			images: repositoryImages,
			seats: repositorySeats,
			traktApi: repositoryTraktApi
		};

		return repositories;
	}

	#initializeServices()
	{
		const cache = new UtilsCache();

		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }

		check(ServicesUser, InterfacesServicesUser);
		const serviceUser = new ServicesUser(this.#repositories.localStorage);

		check(ServicesTickets, InterfacesServicesTickets);
		const serviceTickets = new ServicesTickets(this.#repositories.traktApi, cache);

		const services =
		{
			user: serviceUser,
			tickets: serviceTickets
		};

		return services;
	}
	
	#initializeModels()
	{
		const check = (object, base) => { UtilsCheckers.checkInstance(object, base); }

		check(ModelsUser, InterfacesModelsUser);
		const ModelUser = new ModelsUser(this.#services.user);

		check(ModelsTickets, InterfacesModelsTickets);
		const ModelTickets = new ModelsTickets(this.#services.tickets);

		const models =
		{
			user: ModelUser,
			tickets: ModelTickets
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
		
		check(ViewsTickets, InterfacesViewsTickets);
		const ViewTickets = new ViewsTickets();

		check(ViewsAuth, InterfacesViews);
		const ViewAuth = new ViewsAuth();

		const views =
		{
			default: ViewDefault,
			header: ViewHeader,
			home: ViewHome,
			tickets: ViewTickets,
			auth: ViewAuth
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

		check(ControllersTickets, InterfacesControllers);
		const ControllerTickets = new ControllersTickets(this.#models.tickets, this.#views.tickets);

		check(ControllersAuth, InterfacesControllers);
		const ControllerAuth = new ControllersAuth(this.#models.user, this.#views.auth);

		const controllers =
		{
			default: ControllerDefault,
			header: ControllerHeader,
			notFound: ControllerNotFound,
			home: ControllerHome,
			tickets: ControllerTickets,
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
				this.#controllers.tickets,
				this.#controllers.auth
			]
		);

		return router;
	}

	async initializeApp()
	{
		try
		{
			this.#sources = await this.#initializeSources();
			this.#repositories = this.#initializeRepositories();
			this.#services = this.#initializeServices();
			this.#models = this.#initializeModels();
			this.#views = this.#initializeViews();
			this.#controllers = this.#initializeControllers();
			this.#router = this.#initializeRouter();

			await this.#router.handleRoute();
		}
		catch (error) { console.error("Failed to initialize Web Application:", error); }
	}
}

const webApp = new WebApp();
await webApp.initializeApp();

export default WebApp;