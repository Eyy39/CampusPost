module.exports = (...allowedRoles) => (req, res, next) => {
	const role = req.user?.role || req.headers['x-user-role'];

	if (!allowedRoles.includes(role)) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	next();
};
