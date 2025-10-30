import { Router } from "../Router.js";

class ControllersAuth
{
	static getRequiredFields() { return ["model", "view", "name"]; }
	static getRequiredMethods() { return ["initialize"]; }
	
	name = "auth_controller";

	constructor(modelAuth, viewAuth)
	{
		if (ControllersAuth.instance) { return ControllersAuth.instance; }
		ControllersAuth.instance = this;

		this.model = modelAuth;
		this.view = viewAuth;
	}

	async initialize(html) { this.view.render(html, this.#bindEvents.bind(this)); }

	#bindEvents()
	{
		this.view.getElement('#login-form').addEventListener
		(
			'submit',
			async (event) =>
			{
				event.preventDefault();
				await this.#login(event.target);
			}
		);

		this.view.getElement('#register-form').addEventListener
		(
			'submit',
			async (event) =>
			{
				event.preventDefault();
				await this.#register(event.target);
			}
		);
	}

	async #login(event)
	{
		const formData = new FormData(event);

		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || username.trim() == "") { alert("Username is required."); return; }
		if (!password || password.trim() == "") { alert("Password is required."); return; }

		if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) { alert("Password must be at least 6 characters long and contain a mix of uppercase, lowercase, and numeric characters."); return; }

		const userData = { username, password };
		const result = await this.model.login(userData);

		if (result) { alert("Login successful!"); this.view.getElement('#login-form').reset(); await (new Router()).navigateTo("/"); }
		else { alert("Login failed. Please try again"); }
	}

	async #register(event)
	{
		const formData = new FormData(event);

		const username = formData.get('username');
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirm-password');

		if (!username || username.trim() == "") { alert("Username is required."); return; }
		if (!email || email.trim() == "") {  alert("Email is required."); return; }
		if (!password || password.trim() == "") {  alert("Password is required."); return; }
		if (!confirmPassword || confirmPassword.trim() == "") {  alert("Confirm Password is required."); return; }

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Invalid email format."); return; }

		if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) { alert("Password must be at least 6 characters long and contain a mix of uppercase, lowercase, and numeric characters."); return; }
		if (password !== confirmPassword) { alert("Passwords do not match."); return; }

		const userData = { username, email, password };

		const result = await this.model.register(userData);

		if (result) { alert("Registration successful! You can now log in"); this.view.getElement('#register-form').reset(); }
		else { alert("Registration failed. Please try again"); }
	}
}

export { ControllersAuth };