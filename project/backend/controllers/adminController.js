const { Application, User, University, Scholarship, sequelize } = require('../models');

exports.dashboard = async (req, res) => {
  try {
    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalUsers,
      totalUniversities,
      totalScholarships,
      recentApplications,
      recentUsers,
    ] = await Promise.all([
      Application.count(),
      Application.count({ where: { admin_status: 'pending' } }),
      Application.count({ where: { admin_status: 'approved' } }),
      Application.count({ where: { admin_status: 'rejected' } }),
      User.count(),
      University.count(),
      Scholarship.count(),
      Application.findAll({
        order: [['application_id', 'DESC']],
        limit: 5,
        include: [
          { model: University, attributes: ['name'] },
        ],
      }),
      User.findAll({
        order: [['created_at', 'DESC']],
        limit: 5,
        attributes: { exclude: ['password'] },
      }),
    ]);

    res.json({
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalUsers,
      totalUniversities,
      totalScholarships,
      recentApplications,
      recentUsers,
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalUsers,
      totalUniversities,
    ] = await Promise.all([
      Application.count(),
      Application.count({ where: { admin_status: 'pending' } }),
      Application.count({ where: { admin_status: 'approved' } }),
      Application.count({ where: { admin_status: 'rejected' } }),
      User.count(),
      University.count(),
    ]);

    res.json({
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalUsers,
      totalUniversities,
    });
  } catch (error) {
    console.error('Stats error:', error.message);
    res.status(500).json({ message: 'Failed to load stats' });
  }
};

exports.listApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      order: [['application_id', 'DESC']],
      include: [
        { model: University, attributes: ['name'] },
        { model: User, attributes: { exclude: ['password'] } },
      ],
    });
    res.json(applications);
  } catch (error) {
    console.error('Admin list applications error:', error.message);
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
    console.error('Approve error:', error.message);
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
    console.error('Reject error:', error.message);
    res.status(400).json({ message: 'Failed to reject application' });
  }
};
