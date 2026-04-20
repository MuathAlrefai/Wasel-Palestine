const router = require("express").Router();
const controller = require("../controllers/auditController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.get(
  "/moderation",
  authenticate,
  authorize("ADMIN"),
  controller.listModerationActions,
);

module.exports = router;
