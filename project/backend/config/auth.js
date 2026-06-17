module.exports = {
	authHeader: process.env.AUTH_HEADER || 'authorization',
	defaultRole: process.env.DEFAULT_ROLE || 'user',
	adminRole: process.env.ADMIN_ROLE || 'admin',
};
