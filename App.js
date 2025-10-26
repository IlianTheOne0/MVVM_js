import fs from "fs";

import instanceChecker from "./Infrastructure/Utils/InstanceChecker.js";

import InterfacesDataSourcesApi from "./Data/Interfaces/Interfaces.Sources.Api.js";
import SourcesTraktApi from "./Data/DataSources/Sources.TraktApi.js";

try
{
	instanceChecker(SourcesTraktApi, InterfacesDataSourcesApi);

	const keysPath = "./Data/.env/keys.json";
	const keysData = JSON.parse(fs.readFileSync(keysPath, "utf-8"));

	const traktApiSource = new SourcesTraktApi(keysData.clientId);
	await traktApiSource.initialize();
	console.log(await traktApiSource.testConnection());
}
catch (error) { console.error(error, error.stack); }