const { User } = require('../models');

exports.register = async (req, res) => {
	try {
		const user = await User.create(req.body);
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ message: 'Registration failed' });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email, password } });

		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		res.json({ message: 'Login successful', user });
	} catch (error) {
		res.status(500).json({ message: 'Login failed' });
	}
};

exports.me = async (req, res) => {
	res.json({ message: 'Auth skeleton ready', user: req.user || null });
};

exports.logout = async (req, res) => {
	res.json({ message: 'Logout route ready' });
};
