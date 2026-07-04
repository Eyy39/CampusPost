const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, applicationController.listApplications);
router.post("/", authenticate, applicationController.createApplication);
router.get("/:id", authenticate, applicationController.getApplication);
router.put("/draft/:id", authenticate, applicationController.saveDraft);
router.put("/:id", authenticate, applicationController.updateApplication);
router.delete("/:id", authenticate, applicationController.deleteApplication);

module.exports = router;
