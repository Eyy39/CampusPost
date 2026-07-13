const { Review, User, University } = require('../models');

exports.listReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, attributes: ['first_name', 'last_name'] },
        { model: University, attributes: ['name'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(reviews);
  } catch (error) {
    console.error('List reviews error:', error.message);
    res.status(500).json({ message: 'Failed to load reviews' });
  }
};

exports.createReview = async (req, res) => {
	try {
		const review = await Review.create(req.body);
		res.status(201).json(review);
	} catch (error) {
		res.status(400).json({ message: 'Invalid review payload' });
	}
};

exports.updateReview = async (req, res) => {
	try {
		const review = await Review.findByPk(req.params.id);

		if (!review) {
			return res.status(404).json({ message: 'Review not found' });
		}

		await review.update(req.body);
		res.json(review);
	} catch (error) {
		res.status(400).json({ message: 'Failed to update review' });
	}
};

exports.deleteReview = async (req, res) => {
	try {
		const review = await Review.findByPk(req.params.id);

		if (!review) {
			return res.status(404).json({ message: 'Review not found' });
		}

		await review.destroy();
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete review' });
	}
};
