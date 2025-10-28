import fs from "fs";

class MainApp
{
	#currentApp;

	constructor()
	{
		if (MainApp.instance) { return MainApp.instance; }
		MainApp.instance = this;

		this.#currentApp = null;
	}

	async #initializeWebApp()
	{
		console.log("To initialize the Web Application, start the app from browser");
		return "webApp";
	}

	async run(...args)
	{
		if (args.length === 0) { throw new Error("No application type specified."); }
		const appType = args[0];

		switch (appType)
		{
			case "web": { this.#currentApp = await this.#initializeWebApp(); } break;
			default: { throw new Error(`Unknown application type: ${appType}`); }
		}
	}
}

const appConfigPath = "./.env/appConfig.json";
const appConfigData = JSON.parse(fs.readFileSync(appConfigPath, "utf-8"));

const mainApp = new MainApp();
await mainApp.run(appConfigData.appType);