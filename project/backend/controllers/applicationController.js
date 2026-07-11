const { Application, ApplicantProfile, AcademicInformation, ApplicationDocument, University, Major, Scholarship, sequelize } = require('../models');

exports.listApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { user_id: req.user.id },
      order: [['application_id', 'DESC']],
      include: [
        { model: ApplicantProfile, as: 'ApplicantProfile' },
        { model: AcademicInformation, as: 'AcademicInformation' },
        { model: ApplicationDocument, as: 'ApplicationDocuments' },
        { model: University, attributes: ['name', 'city', 'country'] },
        { model: Major, attributes: ['major_name', 'degree_level'] },
        { model: Scholarship, attributes: ['title'] },
      ],
    });
    res.json(applications);
  } catch (error) {
    console.error('List error:', error.message);
    res.status(500).json({ message: 'Failed to load applications' });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [
        { model: ApplicantProfile, as: 'ApplicantProfile' },
        { model: AcademicInformation, as: 'AcademicInformation' },
        { model: ApplicationDocument, as: 'ApplicationDocuments' },
        { model: University, attributes: ['name', 'city', 'country'] },
        { model: Major, attributes: ['major_name', 'degree_level'] },
        { model: Scholarship, attributes: ['title'] },
      ],
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (application.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(application);
  } catch (error) {
    console.error('Get error:', error.message);
    res.status(500).json({ message: 'Failed to load application' });
  }
};

exports.createApplication = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      scholarship_id, university_id, major_id, admin_status,
      profile, academic, documents,
    } = req.body;

    const user_id = req.user.id;

    const application = await Application.create({
      user_id,
      scholarship_id: scholarship_id || null,
      university_id,
      major_id,
      status_id: 1,
      admin_status: admin_status || 'draft',
    }, { transaction: t });

    if (profile) {
      await ApplicantProfile.create({
        application_id: application.application_id,
        ...profile,
      }, { transaction: t });
    }

    if (academic) {
      await AcademicInformation.create({
        application_id: application.application_id,
        ...academic,
      }, { transaction: t });
    }

    if (documents && documents.length) {
      await ApplicationDocument.bulkCreate(
        documents.map((d) => ({
          application_id: application.application_id,
          ...d,
        })),
        { transaction: t }
      );
    }

    await t.commit();

    const result = await Application.findByPk(application.application_id, {
      include: [
        { model: ApplicantProfile, as: 'ApplicantProfile' },
        { model: AcademicInformation, as: 'AcademicInformation' },
        { model: ApplicationDocument, as: 'ApplicationDocuments' },
        { model: University, attributes: ['name'] },
        { model: Major, attributes: ['major_name', 'degree_level'] },
      ],
    });

    res.status(201).json(result);
  } catch (error) {
    await t.rollback();
    console.error('Create error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const application = await Application.findByPk(req.params.id, { transaction: t });
    if (!application) {
      await t.rollback();
      return res.status(404).json({ message: 'Application not found' });
    }

    const { profile, academic, documents, ...appFields } = req.body;

    await application.update(appFields, { transaction: t });

    if (profile) {
      await ApplicantProfile.upsert(
        { application_id: application.application_id, ...profile },
        { transaction: t }
      );
    }

    if (academic) {
      await AcademicInformation.upsert(
        { application_id: application.application_id, ...academic },
        { transaction: t }
      );
    }

    if (documents && documents.length) {
      await ApplicationDocument.destroy({
        where: { application_id: application.application_id },
        transaction: t,
      });
      await ApplicationDocument.bulkCreate(
        documents.map((d) => ({
          application_id: application.application_id,
          ...d,
        })),
        { transaction: t }
      );
    }

    await t.commit();

    const result = await Application.findByPk(application.application_id, {
      include: [
        { model: ApplicantProfile, as: 'ApplicantProfile' },
        { model: AcademicInformation, as: 'AcademicInformation' },
        { model: ApplicationDocument, as: 'ApplicationDocuments' },
        { model: University, attributes: ['name'] },
        { model: Major, attributes: ['major_name', 'degree_level'] },
      ],
    });

    res.json(result);
  } catch (error) {
    await t.rollback();
    console.error('Update error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.saveDraft = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (req.params.id === 'new') {
      const { user_id, ...rest } = req.body;
      const application = await Application.create({
        ...rest,
        user_id: req.user.id,
        status_id: 1,
        admin_status: 'draft',
      }, { transaction: t });
      await t.commit();
      return res.status(201).json(application);
    }

    const application = await Application.findByPk(req.params.id, { transaction: t });
    if (!application) {
      await t.rollback();
      return res.status(404).json({ message: 'Application not found' });
    }
    await application.update({ ...req.body, admin_status: 'draft' }, { transaction: t });
    await t.commit();
    res.json(application);
  } catch (error) {
    await t.rollback();
    console.error('Save draft error:', error.message);
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
    console.error('Delete error:', error.message);
    res.status(500).json({ message: 'Failed to delete application' });
  }
};
