const { Favorite } = require('../models');

exports.listFavorites = async (req, res) => {
	try {
		const favorites = await Favorite.findAll();
		res.json(favorites);
	} catch (error) {
		res.status(500).json({ message: 'Failed to load favorites' });
	}
};

exports.createFavorite = async (req, res) => {
	try {
		const favorite = await Favorite.create(req.body);
		res.status(201).json(favorite);
	} catch (error) {
		res.status(400).json({ message: 'Invalid favorite payload' });
	}
};

exports.deleteFavorite = async (req, res) => {
	try {
		const favorite = await Favorite.findByPk(req.params.id);

		if (!favorite) {
			return res.status(404).json({ message: 'Favorite not found' });
		}

		await favorite.destroy();
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete favorite' });
	}
};
