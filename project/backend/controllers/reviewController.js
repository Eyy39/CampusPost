const { Review, User, University, Comment } = require('../models');

exports.listReviews = async (req, res) => {
  try {
    const where = req.query.university_id ? { university_id: req.query.university_id } : {};
    const reviews = await Review.findAll({
      where,
      include: [
        { model: User, attributes: ['user_id', 'first_name', 'last_name'] },
        { model: University, attributes: ['name'] },
        {
          model: Comment,
          as: 'Comments',
          include: [{ model: User, attributes: ['user_id', 'first_name', 'last_name'] }],
        },
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
    const review = await Review.create({
      user_id: req.user.id,
      university_id: req.body.university_id,
      rating: req.body.rating,
      comment: req.body.comment,
    });
    const full = await Review.findByPk(review.review_id, {
      include: [
        { model: User, attributes: ['user_id', 'first_name', 'last_name'] },
        { model: Comment, as: 'Comments', include: [{ model: User, attributes: ['user_id', 'first_name', 'last_name'] }] },
      ],
    });
    res.status(201).json(full);
  } catch (error) {
    console.error('Create review error:', error.message);
    res.status(400).json({ message: error.message || 'Invalid review payload' });
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
