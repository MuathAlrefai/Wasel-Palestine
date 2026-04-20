const router = require("express").Router();
const controller = require("../controllers/incidentController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  createIncidentValidator,
  incidentIdValidator,
  listIncidentsValidator,
} = require("../validators/incidentValidators");

router.get(
  "/",
  listIncidentsValidator,
  validateRequest,
  controller.listIncidents,
);

router.post(
  "/",
  authenticate,
  authorize("MODERATOR", "ADMIN"),
  createIncidentValidator,
  validateRequest,
  controller.createIncident,
);

router.post(
  "/:id/verify",
  authenticate,
  authorize("MODERATOR", "ADMIN"),
  incidentIdValidator,
  validateRequest,
  controller.verifyIncident,
);

router.post(
  "/:id/close",
  authenticate,
  authorize("MODERATOR", "ADMIN"),
  incidentIdValidator,
  validateRequest,
  controller.closeIncident,
);

module.exports = router;
