const express = require("express");
const { getMessageContext } = require("../utils/message-context");
const { SESSION_CONFIG } = require("../services/constants");

const router = express.Router();
const messageContext = getMessageContext(SESSION_CONFIG);

// Endpoint de saúde
router.get("/", async (req, res, next) => {
  try {
    const activeSessions = await messageContext.getActiveSessionCount();
    res.json({
      status: "ok",
      activeSessions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
