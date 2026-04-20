const router = require("express").Router();
const controller = require("../controllers/checkpointController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  createCheckpointValidator,
  updateCheckpointStatusValidator,
  listCheckpointsValidator,
} = require("../validators/checkpointValidators");

router.get(
  "/",
  listCheckpointsValidator,
  validateRequest,
  controller.listCheckpoints,
);

router.post(
  "/",
  authenticate,
  authorize("MODERATOR", "ADMIN"),
  createCheckpointValidator,
  validateRequest,
  controller.createCheckpoint,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("MODERATOR", "ADMIN"),
  updateCheckpointStatusValidator,
  validateRequest,
  controller.updateCheckpointStatus,
);

module.exports = router;
