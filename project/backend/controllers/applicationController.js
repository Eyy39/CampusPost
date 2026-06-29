const { Application } = require('../models');

exports.listApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({ order: [['updatedAt', 'DESC']] });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load applications' });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load application' });
  }
};

exports.createApplication = async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    console.error('Create error:', error.message, error.parent?.sqlMessage);
    res.status(400).json({ message: error.message, sql: error.parent?.sqlMessage });
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
    console.error('Update error:', error.message, error.parent?.sqlMessage);
    res.status(400).json({ message: error.message, sql: error.parent?.sqlMessage });
  }
};

exports.saveDraft = async (req, res) => {
  try {
    if (req.params.id === 'new') {
      const application = await Application.create({ ...req.body, status: 'draft' });
      return res.status(201).json(application);
    }
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    await application.update({ ...req.body, status: 'draft' });
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: 'Failed to save draft' });
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
