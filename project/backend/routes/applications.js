const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.get('/', applicationController.listApplications);
router.post('/', applicationController.createApplication);
router.get('/:id', applicationController.getApplication);
router.put('/draft/:id', applicationController.saveDraft);
router.put('/:id', applicationController.updateApplication);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;
