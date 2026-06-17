const { Scholarship } = require('../models');

exports.listScholarships = async (req, res) => {
	try {
		const scholarships = await Scholarship.findAll();
		res.json(scholarships);
	} catch (error) {
		res.status(500).json({ message: 'Failed to load scholarships' });
	}
};

exports.getScholarshipById = async (req, res) => {
	try {
		const scholarship = await Scholarship.findByPk(req.params.id);

		if (!scholarship) {
			return res.status(404).json({ message: 'Scholarship not found' });
		}

		res.json(scholarship);
	} catch (error) {
		res.status(500).json({ message: 'Failed to load scholarship' });
	}
};

exports.createScholarship = async (req, res) => {
	try {
		const scholarship = await Scholarship.create(req.body);
		res.status(201).json(scholarship);
	} catch (error) {
		res.status(400).json({ message: 'Invalid scholarship payload' });
	}
};

exports.updateScholarship = async (req, res) => {
	try {
		const scholarship = await Scholarship.findByPk(req.params.id);

		if (!scholarship) {
			return res.status(404).json({ message: 'Scholarship not found' });
		}

		await scholarship.update(req.body);
		res.json(scholarship);
	} catch (error) {
		res.status(400).json({ message: 'Failed to update scholarship' });
	}
};

exports.deleteScholarship = async (req, res) => {
	try {
		const scholarship = await Scholarship.findByPk(req.params.id);

		if (!scholarship) {
			return res.status(404).json({ message: 'Scholarship not found' });
		}

		await scholarship.destroy();
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete scholarship' });
	}
};
