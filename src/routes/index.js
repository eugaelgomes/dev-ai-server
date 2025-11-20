const express = require("express");

const homeRoutes = require("./home.routes");
const searchRoutes = require("./search.routes");
const sessionRoutes = require("./session.routes");

const router = express.Router();

router.use("/", homeRoutes);
router.use("/search", searchRoutes);
router.use("/session", sessionRoutes);

module.exports = router;
