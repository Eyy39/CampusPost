const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const commentController = require('../controllers/commentController');
const authenticate = require('../middleware/authMiddleware');

router.get('/', reviewController.listReviews);
router.post('/', authenticate, reviewController.createReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

router.get('/:reviewId/comments', commentController.listCommentsByReview);
router.post('/:reviewId/comments', authenticate, commentController.createComment);
router.delete('/:reviewId/comments/:id', authenticate, commentController.deleteComment);

module.exports = router;
