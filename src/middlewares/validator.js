const {
  VALID_SUBJECTS,
  VALID_PROVIDERS,
  VALID_MODELS,
  DEFAULT_MODELS,
} = require("../config/constants");
const { applyGuardRails } = require("../utils/guard-rails");

/**
 * Middleware para validar o request do endpoint /search
 */
function validateSearchRequest(req, res, next) {
  // Validação do body
  if (!req.body) {
    return res.status(400).json({ error: "Request body is required" });
  }

  const { message, subjects, model, provider, sessionId } = req.body;

  // Validação ou geração do sessionId
  req.sessionId =
    sessionId ||
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Validação do subjects (pode ser string ou array)
  if (!subjects) {
    return res.status(400).json({
      error: `Subjects parameter is required and must be one or more of: ${VALID_SUBJECTS.join(", ")}`,
    });
  }

  // Normaliza subjects para array
  const subjectsArray = Array.isArray(subjects) ? subjects : [subjects];
  
  // Valida cada subject
  const invalidSubjects = subjectsArray.filter(
    s => !VALID_SUBJECTS.includes(s.toLowerCase())
  );
  
  if (invalidSubjects.length > 0) {
    return res.status(400).json({
      error: `Invalid subject(s): ${invalidSubjects.join(", ")}. Must be one or more of: ${VALID_SUBJECTS.join(", ")}`,
    });
  }

  // Remove duplicatas e normaliza para lowercase
  req.validatedSubjects = [...new Set(subjectsArray.map(s => s.toLowerCase()))];

  // Validação do provider (obrigatório)
  if (!provider || !VALID_PROVIDERS.includes(provider.toLowerCase())) {
    return res.status(400).json({
      error: `Provider parameter is required and must be one of: ${VALID_PROVIDERS.join(", ")}`,
    });
  }
  req.selectedProvider = provider.toLowerCase();

  // Validação da message
  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({
      error: "Message parameter is required and must be a non-empty string",
    });
  }
  req.validatedMessage = message;

  // Aplica guard rails para todos os subjects selecionados
  // A mensagem é válida se passar em pelo menos um dos subjects
  const guardRailResults = req.validatedSubjects.map(subject => ({
    subject,
    result: applyGuardRails(message, subject)
  }));
  
  const anyValid = guardRailResults.some(gr => gr.result.isValid);
  
  if (!anyValid) {
    const reasons = guardRailResults.map(gr => `${gr.subject}: ${gr.result.reason}`).join("; ");
    return res.status(400).json({
      error: "Message validation failed for all selected subjects",
      reasons,
    });
  }

  // Validação do provider (obrigatório)
  if (!provider || !VALID_PROVIDERS.includes(provider.toLowerCase())) {
    return res.status(400).json({
      error: `Provider parameter is required and must be one of: ${VALID_PROVIDERS.join(", ")}`,
    });
  }
  req.selectedProvider = provider.toLowerCase();

  // Validação do model (opcional, mas se fornecido deve ser válido para o provider)
  const providerModels = VALID_MODELS[req.selectedProvider];
  if (model && !providerModels.includes(model.toLowerCase())) {
    return res.status(400).json({
      error: `Model must be one of: ${providerModels.join(", ")} for provider ${req.selectedProvider}`,
      defaultUsed: DEFAULT_MODELS[req.selectedProvider],
    });
  }
  req.selectedModel =
    model && providerModels.includes(model.toLowerCase())
      ? model.toLowerCase()
      : DEFAULT_MODELS[req.selectedProvider];

  next();
}

module.exports = {
  validateSearchRequest,
};
