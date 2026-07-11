const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');

router.get('/dashboard', authenticate, adminController.dashboard);
router.get('/stats', authenticate, adminController.getStats);
router.get('/applications', authenticate, adminController.listApplications);
router.put('/applications/:id/approve', authenticate, adminController.approveApplication);
router.put('/applications/:id/reject', authenticate, adminController.rejectApplication);

module.exports = router;
