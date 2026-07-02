const { Application } = require('../models');

exports.dashboard = async (req, res) => {
  res.json({ message: 'Admin dashboard skeleton ready' });
};

exports.getStats = async (req, res) => {
  res.json({ message: 'Admin stats skeleton ready' });
};

exports.listApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load applications' });
  }
};

exports.approveApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    await application.update({
      admin_status: 'approved',
      admin_note: req.body.note || null,
    });
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: 'Failed to approve application' });
  }
};

exports.rejectApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    await application.update({
      admin_status: 'rejected',
      admin_note: req.body.note || null,
    });
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: 'Failed to reject application' });
  }
};
