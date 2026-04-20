const router = require("express").Router();
const controller = require("../controllers/routeController");
const validateRequest = require("../middleware/validateRequest");
const { estimateRouteValidator } = require("../validators/routeValidators");

router.post(
  "/estimate",
  estimateRouteValidator,
  validateRequest,
  controller.estimate,
);

module.exports = router;
