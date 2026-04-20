const router = require("express").Router();
const controller = require("../controllers/subscriptionController");
const { authenticate } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  createSubscriptionValidator,
} = require("../validators/subscriptionValidators");

router.post(
  "/",
  authenticate,
  createSubscriptionValidator,
  validateRequest,
  controller.createSubscription,
);

router.get("/me", authenticate, controller.listMySubscriptions);
router.get("/me/alerts", authenticate, controller.listMyAlerts);

module.exports = router;
