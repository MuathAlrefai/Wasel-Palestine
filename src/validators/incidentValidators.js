const { body, param, query } = require("express-validator");
const {
  INCIDENT_CATEGORIES,
  INCIDENT_SEVERITIES,
  INCIDENT_STATUSES,
  INCIDENT_SOURCE_TYPES,
} = require("../constants/enums");

const createIncidentValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("title must be between 3 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("description must not exceed 1000 characters"),

  body("category")
    .notEmpty()
    .withMessage("category is required")
    .isIn(INCIDENT_CATEGORIES)
    .withMessage(`category must be one of: ${INCIDENT_CATEGORIES.join(", ")}`),

  body("severity")
    .notEmpty()
    .withMessage("severity is required")
    .isIn(INCIDENT_SEVERITIES)
    .withMessage(`severity must be one of: ${INCIDENT_SEVERITIES.join(", ")}`),

  body("status")
    .optional()
    .isIn(INCIDENT_STATUSES)
    .withMessage(`status must be one of: ${INCIDENT_STATUSES.join(", ")}`),

  body("sourceType")
    .optional()
    .isIn(INCIDENT_SOURCE_TYPES)
    .withMessage(
      `sourceType must be one of: ${INCIDENT_SOURCE_TYPES.join(", ")}`,
    ),

  body("locationLat")
    .notEmpty()
    .withMessage("locationLat is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("locationLat must be between -90 and 90"),

  body("locationLng")
    .notEmpty()
    .withMessage("locationLng is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("locationLng must be between -180 and 180"),

  body("region")
    .trim()
    .notEmpty()
    .withMessage("region is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("region must be between 2 and 100 characters"),

  body("checkpointId")
    .optional({ nullable: true, checkFalsy: true })
    .isUUID()
    .withMessage("checkpointId must be a valid UUID"),
];

const incidentIdValidator = [
  param("id").isUUID().withMessage("incident id must be a valid UUID"),
];

const listIncidentsValidator = [
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
    .isIn(INCIDENT_CATEGORIES)
    .withMessage(`category must be one of: ${INCIDENT_CATEGORIES.join(", ")}`),

  query("severity")
    .optional()
    .isIn(INCIDENT_SEVERITIES)
    .withMessage(`severity must be one of: ${INCIDENT_SEVERITIES.join(", ")}`),

  query("status")
    .optional()
    .isIn(INCIDENT_STATUSES)
    .withMessage(`status must be one of: ${INCIDENT_STATUSES.join(", ")}`),

  query("region")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("region must be between 1 and 100 characters"),
];

module.exports = {
  createIncidentValidator,
  incidentIdValidator,
  listIncidentsValidator,
};
