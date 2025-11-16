const express = require("express");

const homeRoutes = require("./home.routes");
const searchRoutes = require("./search.routes");
const sessionRoutes = require("./session.routes");
const healthRoutes = require("./health.routes");

const router = express.Router();

router.use("/", homeRoutes);
router.use("/search", searchRoutes);
router.use("/session", sessionRoutes);
router.use("/health", healthRoutes);

module.exports = router;
