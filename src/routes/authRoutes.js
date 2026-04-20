const router = require("express").Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");
const validateRequest = require("../middleware/validateRequest");
const {
  registerValidator,
  loginValidator,
  refreshValidator,
  logoutValidator,
} = require("../validators/authValidators");

router.post(
  "/register",
  authLimiter,
  registerValidator,
  validateRequest,
  authController.register,
);

router.post(
  "/login",
  authLimiter,
  loginValidator,
  validateRequest,
  authController.login,
);

router.post(
  "/refresh",
  authLimiter,
  refreshValidator,
  validateRequest,
  authController.refresh,
);

router.post("/logout", logoutValidator, validateRequest, authController.logout);

router.get("/me", authenticate, authController.me);

module.exports = router;
