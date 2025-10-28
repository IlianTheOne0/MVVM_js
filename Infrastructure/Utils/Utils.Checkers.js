import UtilsCheckersInstance from "./Checkers/Utils.Checkers.Instance.js";
import UtilsCheckersArgument from "./Checkers/Utils.Checkers.Argument.js";

class UtilsCheckers
{
	static checkInstance(object, base) { return UtilsCheckersInstance.execute(object, base); }
	static checkArgument(argument, ...type) { return UtilsCheckersArgument.execute(argument, ...type); }
}

export default UtilsCheckers;