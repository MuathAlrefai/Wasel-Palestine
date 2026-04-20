const { body, param, query } = require("express-validator");
const {
  REPORT_CATEGORIES,
  REPORT_MODERATION_ACTIONS,
  REPORT_VOTE_TYPES,
} = require("../constants/enums");

const createReportValidator = [
  body("category")
    .notEmpty()
    .withMessage("category is required")
    .isIn(REPORT_CATEGORIES)
    .withMessage(`category must be one of: ${REPORT_CATEGORIES.join(", ")}`),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("description is required")
    .isLength({ min: 5, max: 1000 })
    .withMessage("description must be between 5 and 1000 characters"),

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

  body("reportTime")
    .notEmpty()
    .withMessage("reportTime is required")
    .isISO8601()
    .withMessage("reportTime must be a valid ISO 8601 date"),
];

const listReportsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),

  query("size")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("size must be between 1 and 100"),

  query("category")
    .optional()
    .isIn(REPORT_CATEGORIES)
    .withMessage(`category must be one of: ${REPORT_CATEGORIES.join(", ")}`),

  query("region")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("region must be between 1 and 100 characters"),
];

const reportIdValidator = [
  param("id").isUUID().withMessage("report id must be a valid UUID"),
];

const voteReportValidator = [
  param("id").isUUID().withMessage("report id must be a valid UUID"),

  body("voteType")
    .notEmpty()
    .withMessage("voteType is required")
    .isIn(REPORT_VOTE_TYPES)
    .withMessage(`voteType must be one of: ${REPORT_VOTE_TYPES.join(", ")}`),
];

const moderateReportValidator = [
  param("id").isUUID().withMessage("report id must be a valid UUID"),

  body("action")
    .notEmpty()
    .withMessage("action is required")
    .isIn(REPORT_MODERATION_ACTIONS)
    .withMessage(
      `action must be one of: ${REPORT_MODERATION_ACTIONS.join(", ")}`,
    ),

  body("reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("reason must not exceed 500 characters"),

  body("duplicateOfIncidentId")
    .optional({ nullable: true, checkFalsy: true })
    .isUUID()
    .withMessage("duplicateOfIncidentId must be a valid UUID"),
];

module.exports = {
  createReportValidator,
  listReportsValidator,
  reportIdValidator,
  voteReportValidator,
  moderateReportValidator,
};
