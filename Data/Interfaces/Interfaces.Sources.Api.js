class InterfacesDataSourcesApi
{
	static getRequiredFields() { return ["#client", "#clientId"]; }
	static getRequiredMethods() { return ["#query", "initialize", "testConnection"]; }
}

export default InterfacesDataSourcesApi;