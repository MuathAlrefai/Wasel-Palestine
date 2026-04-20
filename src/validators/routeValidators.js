const { body } = require("express-validator");

const estimateRouteValidator = [
  body("origin.lat")
    .notEmpty()
    .withMessage("origin.lat is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("origin.lat must be between -90 and 90"),

  body("origin.lng")
    .notEmpty()
    .withMessage("origin.lng is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("origin.lng must be between -180 and 180"),

  body("destination.lat")
    .notEmpty()
    .withMessage("destination.lat is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("destination.lat must be between -90 and 90"),

  body("destination.lng")
    .notEmpty()
    .withMessage("destination.lng is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("destination.lng must be between -180 and 180"),

  body("avoidCheckpoints")
    .optional()
    .isBoolean()
    .withMessage("avoidCheckpoints must be boolean"),

  body("avoidAreas")
    .optional()
    .isArray()
    .withMessage("avoidAreas must be an array"),
];

module.exports = {
  estimateRouteValidator,
};
