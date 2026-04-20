const { body, param, query } = require("express-validator");
const { CHECKPOINT_STATUSES } = require("../constants/enums");

const createCheckpointValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("name must be between 2 and 150 characters"),

  body("latitude")
    .notEmpty()
    .withMessage("latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("latitude must be between -90 and 90"),

  body("longitude")
    .notEmpty()
    .withMessage("longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("longitude must be between -180 and 180"),

  body("region")
    .trim()
    .notEmpty()
    .withMessage("region is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("region must be between 2 and 100 characters"),

  body("statusCurrent")
    .notEmpty()
    .withMessage("statusCurrent is required")
    .isIn(CHECKPOINT_STATUSES)
    .withMessage(
      `statusCurrent must be one of: ${CHECKPOINT_STATUSES.join(", ")}`,
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("description must not exceed 500 characters"),
];

const updateCheckpointStatusValidator = [
  param("id").isUUID().withMessage("checkpoint id must be a valid UUID"),

  body("status")
    .notEmpty()
    .withMessage("status is required")
    .isIn(CHECKPOINT_STATUSES)
    .withMessage(`status must be one of: ${CHECKPOINT_STATUSES.join(", ")}`),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("note must not exceed 500 characters"),
];

const listCheckpointsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),

  query("size")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("size must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(CHECKPOINT_STATUSES)
    .withMessage(`status must be one of: ${CHECKPOINT_STATUSES.join(", ")}`),

  query("region")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("region must be between 1 and 100 characters"),
];

module.exports = {
  createCheckpointValidator,
  updateCheckpointStatusValidator,
  listCheckpointsValidator,
};
