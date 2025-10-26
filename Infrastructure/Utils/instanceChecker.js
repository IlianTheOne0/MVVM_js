function instanceChecker(object, base)
{
	if
	(
		JSON.stringify(object.getRequiredFields()) !== JSON.stringify(base.getRequiredFields())
		|| JSON.stringify(object.getRequiredMethods()) !== JSON.stringify(base.getRequiredMethods())
	)
	{ throw new Error(`${base.name} implementation is incorrect`); }
}

export default instanceChecker;