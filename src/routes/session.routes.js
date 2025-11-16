const express = require("express");
const { getMessageContext } = require("../utils/message-context");
const { SESSION_CONFIG } = require("../services/constants");

const router = express.Router();
const messageContext = getMessageContext(SESSION_CONFIG);

// Endpoint para obter informações de uma sessão
router.get("/:sessionId", async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const sessionInfo = await messageContext.getSessionInfo(sessionId);

    if (!sessionInfo) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(sessionInfo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
