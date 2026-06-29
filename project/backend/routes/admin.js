const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.dashboard);
router.get('/stats', adminController.getStats);
router.get('/applications', adminController.listApplications);
router.put('/applications/:id/approve', adminController.approveApplication);
router.put('/applications/:id/reject', adminController.rejectApplication);

module.exports = router;
