const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const authenticate = require('../middleware/authMiddleware');

router.get('/', commentController.listCommentsByReview);
router.post('/', authenticate, commentController.createComment);
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
