const router = require("express").Router();

router.use("/auth", require("./authRoutes"));
router.use("/checkpoints", require("./checkpointRoutes"));
router.use("/incidents", require("./incidentRoutes"));
router.use("/reports", require("./reportRoutes"));
router.use("/subscriptions", require("./subscriptionRoutes"));
router.use("/routes", require("./routeRoutes"));
router.use("/audit", require("./auditRoutes"));

module.exports = router;
