module.exports = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ message: 'Authentication required' });
	}

	req.user = req.user || { id: null, role: 'user' };
	next();
};
