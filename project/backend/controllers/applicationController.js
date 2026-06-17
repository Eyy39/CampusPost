const { Application } = require('../models');

exports.listApplications = async (req, res) => {
	try {
		const applications = await Application.findAll();
		res.json(applications);
	} catch (error) {
		res.status(500).json({ message: 'Failed to load applications' });
	}
};

exports.createApplication = async (req, res) => {
	try {
		const application = await Application.create(req.body);
		res.status(201).json(application);
	} catch (error) {
		res.status(400).json({ message: 'Invalid application payload' });
	}
};

exports.updateApplication = async (req, res) => {
	try {
		const application = await Application.findByPk(req.params.id);

		if (!application) {
			return res.status(404).json({ message: 'Application not found' });
		}

		await application.update(req.body);
		res.json(application);
	} catch (error) {
		res.status(400).json({ message: 'Failed to update application' });
	}
};

exports.deleteApplication = async (req, res) => {
	try {
		const application = await Application.findByPk(req.params.id);

		if (!application) {
			return res.status(404).json({ message: 'Application not found' });
		}

		await application.destroy();
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete application' });
	}
};
