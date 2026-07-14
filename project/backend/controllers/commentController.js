const { Comment, User } = require('../models');

exports.listCommentsByReview = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { review_id: req.params.reviewId },
      include: [{ model: User, attributes: ['user_id', 'first_name', 'last_name'] }],
      order: [['createdAt', 'ASC']],
    });
    res.json(comments);
  } catch (error) {
    console.error('List comments error:', error.message);
    res.status(500).json({ message: 'Failed to load comments' });
  }
};

exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      user_id: req.user.id,
      review_id: req.params.reviewId,
      content: req.body.content,
    });
    const full = await Comment.findByPk(comment.comment_id, {
      include: [{ model: User, attributes: ['user_id', 'first_name', 'last_name'] }],
    });
    res.status(201).json(full);
  } catch (error) {
    console.error('Create comment error:', error.message);
    res.status(400).json({ message: error.message || 'Invalid comment payload' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Delete comment error:', error.message);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};
