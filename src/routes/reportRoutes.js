const router = require("express").Router();
const controller = require("../controllers/reportController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { reportLimiter } = require("../middleware/rateLimiter");
const validateRequest = require("../middleware/validateRequest");
const {
  createReportValidator,
  listReportsValidator,
  voteReportValidator,
  moderateReportValidator,
} = require("../validators/reportValidators");

router.post(
  "/",
  reportLimiter,
  createReportValidator,
  validateRequest,
  controller.createReport,
);

router.get(
  "/",
  authenticate,
  authorize("MODERATOR", "ADMIN"),
  listReportsValidator,
  validateRequest,
  controller.listReports,
);

router.post(
  "/:id/vote",
  authenticate,
  voteReportValidator,
  validateRequest,
  controller.voteReport,
);

router.post(
  "/:id/moderate",
  authenticate,
  authorize("MODERATOR", "ADMIN"),
  moderateReportValidator,
  validateRequest,
  controller.moderateReport,
);

module.exports = router;
