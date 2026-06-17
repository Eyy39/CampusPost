const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');

router.get('/', universityController.listUniversities);
router.get('/:id', universityController.getUniversityById);
router.post('/', universityController.createUniversity);
router.put('/:id', universityController.updateUniversity);
router.delete('/:id', universityController.deleteUniversity);

module.exports = router;
