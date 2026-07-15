const { Favorite, University, Major } = require('../models');

// Force restart
exports.listFavorites = async (req, res) => {
	try {
		const favorites = await Favorite.findAll({
			where: { user_id: req.user.id },
			include: [{
				model: University,
				attributes: ['university_id', 'name', 'logo', 'city', 'country', 'ranking'],
				include: [{ model: Major, as: 'Majors', attributes: ['major_name', 'tuition_fee'] }]
			}],
			order: [['favorite_id', 'DESC']]
		});
		res.json(favorites);
	} catch (error) {
		res.status(500).json({ message: 'Failed to load favorites' });
	}
};

exports.createFavorite = async (req, res) => {
	console.log('=== CREATE FAVORITE CALLED ===');
	console.log('User ID:', req.user?.id);
	console.log('Request body:', req.body);
	try {
		const { university_id } = req.body;
		
		if (!university_id) {
			console.log('ERROR: university_id is missing');
			return res.status(400).json({ message: 'university_id is required' });
		}

		const existing = await Favorite.findOne({
			where: { user_id: req.user.id, university_id }
		});
		
		if (existing) {
			console.log('Favorite already exists');
			return res.status(400).json({ message: 'University already in favorites' });
		}
		
		console.log('Creating favorite with user_id:', req.user.id, 'university_id:', university_id);
		const favorite = await Favorite.create({
			user_id: req.user.id,
			university_id
		});
		console.log('Favorite created successfully:', favorite.favorite_id);
		res.status(201).json(favorite);
	} catch (error) {
		console.error('Create favorite error:', error.message, error.stack);
		res.status(400).json({ message: error.message || 'Failed to create favorite' });
	}
};

exports.deleteFavorite = async (req, res) => {
	try {
		const favorite = await Favorite.findOne({
			where: {
				favorite_id: req.params.id,
				user_id: req.user.id
			}
		});

		if (!favorite) {
			return res.status(404).json({ message: 'Favorite not found' });
		}

		await favorite.destroy();
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete favorite' });
	}
};

exports.checkFavorite = async (req, res) => {
	try {
		const favorite = await Favorite.findOne({
			where: {
				user_id: req.user.id,
				university_id: req.params.universityId
			}
		});
		res.json({ isFavorite: !!favorite, favorite_id: favorite ? favorite.favorite_id : null });
	} catch (error) {
		res.status(500).json({ message: 'Failed to check favorite' });
	}
};
