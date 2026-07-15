const { Application, User, University, Scholarship, Major, ApplicantProfile, AcademicInformation, ApplicationDocument, sequelize } = require('../models');

async function getAdminUniversityId(req) {
  const user = await User.findByPk(req.user.id);
  return user ? user.university_id : null;
}

exports.dashboard = async (req, res) => {
  try {
    const university_id = await getAdminUniversityId(req);
    if (!university_id) return res.status(403).json({ message: 'No university assigned' });

    const { Op } = require('sequelize');
    const where = { university_id };
    const whereNoDraft = { university_id, admin_status: { [Op.ne]: 'draft' } };

    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalScholarships,
      recentApplications,
      university,
    ] = await Promise.all([
      Application.count({ where: whereNoDraft }),
      Application.count({ where: { ...where, admin_status: 'pending' } }),
      Application.count({ where: { ...where, admin_status: 'approved' } }),
      Application.count({ where: { ...where, admin_status: 'rejected' } }),
      Scholarship.count({ where }),
      Application.findAll({
        where: whereNoDraft,
        order: [['application_id', 'DESC']],
        limit: 5,
        include: [
          { model: User, attributes: ['first_name', 'last_name', 'email'] },
          { model: Major, attributes: ['major_name'] },
          { model: Scholarship, attributes: ['title'] },
        ],
      }),
      University.findByPk(university_id, { attributes: ['name', 'city', 'country'] }),
    ]);

    res.json({
      university,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalScholarships,
      recentApplications,
    });
  } catch (error) {
    console.error('University admin dashboard error:', error.message);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};

exports.listScholarships = async (req, res) => {
  try {
    const university_id = await getAdminUniversityId(req);
    if (!university_id) return res.status(403).json({ message: 'No university assigned' });

    const scholarships = await Scholarship.findAll({
      where: { university_id },
      order: [['deadline', 'ASC']],
    });
    res.json(scholarships);
  } catch (error) {
    console.error('List scholarships error:', error.message);
    res.status(500).json({ message: 'Failed to load scholarships' });
  }
};

exports.createScholarship = async (req, res) => {
  try {
    const university_id = await getAdminUniversityId(req);
    if (!university_id) return res.status(403).json({ message: 'No university assigned' });

    const scholarship = await Scholarship.create({
      ...req.body,
      university_id,
    });
    res.status(201).json(scholarship);
  } catch (error) {
    console.error('Create scholarship error:', error.message);
    res.status(400).json({ message: 'Invalid scholarship payload' });
  }
};

exports.updateScholarship = async (req, res) => {
  try {
    const university_id = await getAdminUniversityId(req);
    if (!university_id) return res.status(403).json({ message: 'No university assigned' });

    const scholarship = await Scholarship.findOne({
      where: { scholarship_id: req.params.id, university_id },
    });
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

    await scholarship.update(req.body);
    res.json(scholarship);
  } catch (error) {
    console.error('Update scholarship error:', error.message);
    res.status(400).json({ message: 'Failed to update scholarship' });
  }
};

exports.deleteScholarship = async (req, res) => {
  try {
    const university_id = await getAdminUniversityId(req);
    if (!university_id) return res.status(403).json({ message: 'No university assigned' });

    const scholarship = await Scholarship.findOne({
      where: { scholarship_id: req.params.id, university_id },
    });
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

    await scholarship.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Delete scholarship error:', error.message);
    res.status(500).json({ message: 'Failed to delete scholarship' });
  }
};

exports.updateUniversity = async (req, res) => {
  try {
    const university_id = await getAdminUniversityId(req);
    if (!university_id) return res.status(403).json({ message: 'No university assigned' });

    const university = await University.findByPk(university_id);
    if (!university) return res.status(404).json({ message: 'University not found' });

    const { name, description, country, city, address, website, email, phone } = req.body;
    await university.update({ name, description, country, city, address, website, email, phone });
    res.json(university);
  } catch (error) {
    console.error('Update university error:', error.message);
    res.status(400).json({ message: 'Failed to update university profile' });
  }
};

exports.listApplications = async (req, res) => {
  try {
    const university_id = await getAdminUniversityId(req);
    if (!university_id) return res.status(403).json({ message: 'No university assigned' });

    const { Op } = require('sequelize');
    const applications = await Application.findAll({
      where: { university_id, admin_status: { [Op.ne]: 'draft' } },
      order: [['application_id', 'DESC']],
      include: [
        { model: User, attributes: ['first_name', 'last_name', 'email'] },
        { model: Major, attributes: ['major_name', 'degree_level'] },
        { model: Scholarship, attributes: ['title'] },
        { model: ApplicantProfile, as: 'ApplicantProfile' },
        { model: AcademicInformation, as: 'AcademicInformation' },
        { model: ApplicationDocument, as: 'ApplicationDocuments' },
      ],
    });
    res.json(applications);
  } catch (error) {
    console.error('List applications error:', error.message);
    res.status(500).json({ message: 'Failed to load applications' });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const university_id = await getAdminUniversityId(req);
    if (!university_id) return res.status(403).json({ message: 'No university assigned' });

    const application = await Application.findOne({
      where: { application_id: req.params.id, university_id },
      include: [
        { model: User, attributes: ['first_name', 'last_name', 'email', 'phone'] },
        { model: Major, attributes: ['major_name', 'degree_level'] },
        { model: Scholarship, attributes: ['title'] },
        { model: ApplicantProfile, as: 'ApplicantProfile' },
        { model: AcademicInformation, as: 'AcademicInformation' },
        { model: ApplicationDocument, as: 'ApplicationDocuments' },
      ],
    });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    console.error('Get application error:', error.message);
    res.status(500).json({ message: 'Failed to load application' });
  }
};

exports.approveApplication = async (req, res) => {
  try {
    const university_id = await getAdminUniversityId(req);
    if (!university_id) return res.status(403).json({ message: 'No university assigned' });

    const application = await Application.findOne({
      where: { application_id: req.params.id, university_id },
    });
    if (!application) return res.status(404).json({ message: 'Application not found' });

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
    const university_id = await getAdminUniversityId(req);
    if (!university_id) return res.status(403).json({ message: 'No university assigned' });

    const application = await Application.findOne({
      where: { application_id: req.params.id, university_id },
    });
    if (!application) return res.status(404).json({ message: 'Application not found' });

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
