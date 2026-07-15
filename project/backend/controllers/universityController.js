const { University, Major, Scholarship, sequelize } = require('../models');

exports.listUniversities = async (req, res) => {
  try {
    const universities = await University.findAll({
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG(rating), 1) FROM Review WHERE Review.university_id = University.university_id)'), 'avgRating'],
          [sequelize.literal('(SELECT COUNT(*) FROM Review WHERE Review.university_id = University.university_id)'), 'reviewCount'],
        ],
      },
      include: [
        { model: Major, as: 'Majors', separate: true },
        { model: Scholarship, as: 'Scholarships', attributes: ['scholarship_id', 'title'], separate: true },
      ],
      order: [['ranking', 'ASC']],
    });
    res.json(universities);
  } catch (error) {
    console.error('List universities error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to load universities' });
  }
};

exports.getUniversityById = async (req, res) => {
  try {
    const university = await University.findByPk(req.params.id);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }
    res.json(university);
  } catch (error) {
    console.error('Get university error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to load university' });
  }
};

exports.createUniversity = async (req, res) => {
  try {
    const university = await University.create(req.body);
    res.status(201).json(university);
  } catch (error) {
    console.error('Create university error:', error.message);
    res.status(400).json({ message: 'Invalid university payload' });
  }
};

exports.updateUniversity = async (req, res) => {
  try {
    const university = await University.findByPk(req.params.id);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }
    await university.update(req.body);
    res.json(university);
  } catch (error) {
    console.error('Update university error:', error.message);
    res.status(400).json({ message: 'Failed to update university' });
  }
};

exports.deleteUniversity = async (req, res) => {
  try {
    const university = await University.findByPk(req.params.id);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }
    await university.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Delete university error:', error.message);
    res.status(500).json({ message: 'Failed to delete university' });
  }
};
