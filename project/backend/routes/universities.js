const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');
const authenticate = require('../middleware/authMiddleware');
const { Major } = require('../models');

router.get('/', universityController.listUniversities);
router.get('/:id', universityController.getUniversityById);

router.get('/:id/majors', async (req, res) => {
  try {
    const majors = await Major.findAll({
      where: { university_id: req.params.id },
      attributes: ['major_id', 'major_name', 'degree_level', 'duration', 'tuition_fee'],
      order: [['major_id', 'ASC']],
    });
    res.json(majors);
  } catch (error) {
    console.error('List majors error:', error.message);
    res.status(500).json({ message: 'Failed to load majors' });
  }
});

router.post('/', authenticate, universityController.createUniversity);
router.put('/:id', authenticate, universityController.updateUniversity);
router.delete('/:id', authenticate, universityController.deleteUniversity);

module.exports = router;
