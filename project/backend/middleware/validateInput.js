module.exports = (schemaKeys = []) => (req, res, next) => {
	const missingKeys = schemaKeys.filter((key) => req.body[key] === undefined);

	if (missingKeys.length > 0) {
		return res.status(400).json({
			message: 'Missing required fields',
			fields: missingKeys,
		});
	}

	next();
};
