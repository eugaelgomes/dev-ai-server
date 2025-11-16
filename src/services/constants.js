/**
 * Modelos, provedores e assuntos válidos para requests
 */
const VALID_PROVIDERS = ["perplexity", "gemini"];
const VALID_SUBJECTS = ["codigo", "programacao", "dados", "devops"];

const VALID_MODELS = {
  perplexity: [
    "sonar",
    "sonar-pro",
    "sonar-reasoning",
    "sonar-reasoning-pro",
    "sonar-deep-research",
  ],
  gemini: ["gemini-2.5-flash"],
};

const DEFAULT_MODELS = {
  perplexity: "sonar",
  gemini: "gemini-2.5-flash",
};

const SUBJECT_CONTEXT = {
  codigo:
    "Desenvolvimento de software envolvendo escrita, leitura e manutenção de código, incluindo versionamento, boas práticas, debugging e arquitetura.",
  programacao:
    "Princípios, paradigmas e técnicas de programação em diversas linguagens, abordando lógica, estruturas de dados, padrões e resolução de problemas.",
  dados:
    "Processos e técnicas de ciência de dados, engenharia de dados e análise, incluindo ETL, modelagem, bancos de dados, estatística e visualização.",
  devops:
    "Práticas de DevOps relacionadas a infraestrutura, CI/CD, automação, containers, cloud computing, monitoramento e observabilidade.",
};

const SESSION_CONFIG = {
  maxMessagesPerSession: 20,
  sessionTimeout: 30 * 60 * 1000, // 30 minutos
};

/**
 * Combina múltiplos contextos de subjects em uma única descrição
 * @param {Array<string>} subjects - Array de subjects
 * @returns {string} Descrição combinada
 */
function getCombinedContext(subjects) {
  if (subjects.length === 1) {
    return SUBJECT_CONTEXT[subjects[0]];
  }

  const contexts = subjects.map((s) => SUBJECT_CONTEXT[s]);

  if (subjects.length === 2) {
    return `${contexts[0]} e ${contexts[1]}`;
  }

  const lastContext = contexts.pop();
  return `${contexts.join(", ")} e ${lastContext}`;
}

module.exports = {
  VALID_SUBJECTS,
  VALID_PROVIDERS,
  VALID_MODELS,
  DEFAULT_MODELS,
  SUBJECT_CONTEXT,
  SESSION_CONFIG,
  getCombinedContext,
};
