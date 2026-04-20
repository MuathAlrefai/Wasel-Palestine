const { body } = require("express-validator");
const { INCIDENT_CATEGORIES } = require("../constants/enums");

const createSubscriptionValidator = [
  body("region")
    .trim()
    .notEmpty()
    .withMessage("region is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("region must be between 2 and 100 characters"),

  body("category")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(INCIDENT_CATEGORIES)
    .withMessage(`category must be one of: ${INCIDENT_CATEGORIES.join(", ")}`),
];

module.exports = {
  createSubscriptionValidator,
};
