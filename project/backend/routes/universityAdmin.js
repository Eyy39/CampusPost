const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/universityAdminController');
const authenticate = require('../middleware/authMiddleware');

router.get('/dashboard', authenticate, ctrl.dashboard);
router.put('/university', authenticate, ctrl.updateUniversity);
router.get('/scholarships', authenticate, ctrl.listScholarships);
router.post('/scholarships', authenticate, ctrl.createScholarship);
router.put('/scholarships/:id', authenticate, ctrl.updateScholarship);
router.delete('/scholarships/:id', authenticate, ctrl.deleteScholarship);
router.get('/applications', authenticate, ctrl.listApplications);
router.get('/applications/:id', authenticate, ctrl.getApplication);
router.put('/applications/:id/approve', authenticate, ctrl.approveApplication);
router.put('/applications/:id/reject', authenticate, ctrl.rejectApplication);

module.exports = router;
