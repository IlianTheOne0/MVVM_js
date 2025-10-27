import Interfaces from "../../Interfaces/Interfaces.js";

class UtilsCheckersInstance
{
	static execute(object, base)
	{
		if (!object) { throw new Error("Object is null or undefined"); }
		if (!base) { throw new Error("Base is null or undefined"); }
		
		if (!(base.prototype instanceof Interfaces)) { throw new Error("Base must be an instance of Interfaces"); }

		if
		(
			JSON.stringify(object.getRequiredFields()) !== JSON.stringify(base.getRequiredFields())
			|| JSON.stringify(object.getRequiredMethods()) !== JSON.stringify(base.getRequiredMethods())
		)
		{ throw new Error(`${base.name} implementation is incorrect`); }

		return true;
	}
}

export default UtilsCheckersInstance;