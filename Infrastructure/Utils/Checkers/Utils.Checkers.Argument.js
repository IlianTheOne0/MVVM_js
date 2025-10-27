class UtilsCheckersArgument
{
	static execute(argument, ...type)
	{
		switch (type.length)
		{
			case 0: { throw new Error("No types specified for argument checking"); }
			case 1: { if (typeof argument !== type[0]) { throw new Error(`Argument is not of type ${type[0]}`); } return false; }
			default: { if (!type.includes(argument)) { throw new Error(`Argument is not of type ${type.join(", ")}`); } return false; }
		}

		return true;
	}
}

export default UtilsCheckersArgument;