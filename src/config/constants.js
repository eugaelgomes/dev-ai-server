/**
 * Constantes da aplicação
 */

const VALID_SUBJECTS = ["codigo", "programacao", "dados"];

const VALID_MODELS = [
  "sonar",
  "sonar-pro",
  "sonar-reasoning",
  "sonar-reasoning-pro",
  "sonar-deep-research",
];

const DEFAULT_MODEL = "sonar";

const SUBJECT_CONTEXT = {
  codigo: "código e desenvolvimento de software",
  programacao: "programação e linguagens de programação",
  dados: "ciência de dados, análise e engenharia de dados",
};

const SESSION_CONFIG = {
  maxMessagesPerSession: 20,
  sessionTimeout: 30 * 60 * 1000, // 30 minutos
};

module.exports = {
  VALID_SUBJECTS,
  VALID_MODELS,
  DEFAULT_MODEL,
  SUBJECT_CONTEXT,
  SESSION_CONFIG,
};
