const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('=== FAVORITES ROUTE LOADED ===');

router.get('/', authMiddleware, favoriteController.listFavorites);
router.get('/check/:universityId', authMiddleware, favoriteController.checkFavorite);
router.post('/', authMiddleware, favoriteController.createFavorite);
router.delete('/:id', authMiddleware, favoriteController.deleteFavorite);

module.exports = router;
