const { VALID_SUBJECTS, VALID_MODELS, DEFAULT_MODEL } = require("../config/constants");
const { applyGuardRails } = require("../utils/guard-rails");

/**
 * Middleware para validar o request do endpoint /search
 */
function validateSearchRequest(req, res, next) {
  // Validação do body
  if (!req.body) {
    return res.status(400).json({ error: "Request body is required" });
  }

  const { message, subject, model, sessionId } = req.body;

  // Validação ou geração do sessionId
  req.sessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Validação do subject
  if (!subject || !VALID_SUBJECTS.includes(subject.toLowerCase())) {
    return res.status(400).json({
      error: `Subject parameter is required and must be one of: ${VALID_SUBJECTS.join(", ")}`,
    });
  }
  req.validatedSubject = subject.toLowerCase();

  // Validação da message
  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({
      error: "Message parameter is required and must be a non-empty string",
    });
  }
  req.validatedMessage = message;

  // Aplica guard rails
  const guardRailCheck = applyGuardRails(message, req.validatedSubject);
  if (!guardRailCheck.isValid) {
    return res.status(400).json({
      error: "Message validation failed",
      reason: guardRailCheck.reason,
    });
  }

  // Validação do model (opcional, mas se fornecido deve ser válido)
  if (model && !VALID_MODELS.includes(model.toLowerCase())) {
    return res.status(400).json({
      error: `Model must be one of: ${VALID_MODELS.join(", ")}`,
      defaultUsed: DEFAULT_MODEL,
    });
  }
  req.selectedModel = model && VALID_MODELS.includes(model.toLowerCase())
    ? model.toLowerCase()
    : DEFAULT_MODEL;

  next();
}

module.exports = {
  validateSearchRequest,
};
