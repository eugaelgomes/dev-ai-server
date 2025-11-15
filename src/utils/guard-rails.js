const DIGIT_TO_LETTER = {
  0: "o",
  1: "l",
  2: "z",
  3: "e",
  4: "a",
  5: "s",
  6: "g",
  7: "t",
  8: "b",
  9: "g",
};

function normalizeText(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[0-9]/g, digit => DIGIT_TO_LETTER[digit] || digit)
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const BASE_SUBJECT_KEYWORDS = {
  codigo: [
    "codigo",
    "codificacao",
    "codificar",
    "codar",
    "code",
    "bug",
    "debug",
    "git",
    "github",
    "commit",
    "branch",
    "merge",
    "pull request",
    "repository",
    "versao",
    "refactor",
    "clean code",
    "design pattern",
    "solid",
    "api",
    "rest",
    "graphql",
    "microservices",
    "deploy",
    "ci/cd",
    "cicd",
    "devops",
    "docker",
    "kubernetes",
    "container",
    "infra",
    "arquitetura",
    "teste",
    "test",
    "unit test",
    "integration",
    "integration test",
    "tdd",
    "bdd",
    "lint",
    "prettier",
    "eslint",
    "webpack",
    "build",
    "compilation",
    "source",
    "repository",
    "fork",
    "clone",
    "push",
    "pull",
    "pullrequest",
    "merge request",
    "review",
    "code review",
    "pr",
    "pipeline",
    "ci",
    "cd",
    "rollback",
  ],
  programacao: [
    "programacao",
    "programacoes",
    "programador",
    "programadora",
    "programming",
    "coding",
    "javascript",
    "python",
    "java",
    "typescript",
    "node",
    "react",
    "angular",
    "vue",
    "function",
    "funcao",
    "funcoes",
    "classe",
    "class",
    "method",
    "metodo",
    "variavel",
    "variable",
    "loop",
    "array",
    "objeto",
    "objetos",
    "async",
    "await",
    "promise",
    "callback",
    "algorithm",
    "algoritmo",
    "algoritmos",
    "sintaxe",
    "syntax",
    "string",
    "number",
    "boolean",
    "type",
    "interface",
    "generic",
    "enum",
    "struct",
    "pointer",
    "memory",
    "stack",
    "heap",
    "recursion",
    "iteration",
    "sorting",
    "search",
    "binary",
    "hash",
    "tree",
    "graph",
    "linked list",
    "linkedlist",
    "queue",
    "map",
    "set",
    "compiler",
    "interpreter",
    "runtime",
    "framework",
    "library",
    "package",
    "module",
    "import",
    "export",
    "dependency",
    "npm",
    "pip",
    "maven",
    "gradle",
    "ide",
    "editor",
    "debugger",
  ],
  dados: [
    "dados",
    "dado",
    "data",
    "database",
    "banco",
    "sql",
    "sqlserver",
    "nosql",
    "mongodb",
    "postgres",
    "mysql",
    "sqlite",
    "query",
    "tabela",
    "table",
    "analytics",
    "analise",
    "dashboard",
    "relatorio",
    "report",
    "ETL",
    "elt",
    "pipeline",
    "dataframe",
    "pandas",
    "numpy",
    "visualization",
    "visualizacao",
    "estatistica",
    "statistics",
    "ml",
    "machine learning",
    "dataset",
    "training",
    "model",
    "modelo",
    "neural",
    "deep learning",
    "ai",
    "artificial intelligence",
    "ia",
    "regression",
    "classification",
    "clustering",
    "feature",
    "label",
    "predict",
    "bigquery",
    "redshift",
    "snowflake",
    "spark",
    "hadoop",
    "hive",
    "kafka",
    "stream",
    "streaming",
    "batch",
    "warehouse",
    "lake",
    "schema",
    "index",
    "join",
    "aggregate",
    "group by",
    "partition",
    "normalization",
    "denormalization",
    "databricks",
    "lakehouse",
    "powerbi",
    "bi",
    "metadado",
  ],
};

function expandKeywordDictionary(dictionary) {
  return Object.entries(dictionary).reduce((acc, [subject, keywords]) => {
    const expanded = new Set();

    keywords.forEach(keyword => {
      const normalized = normalizeText(keyword);
      if (!normalized) {
        return;
      }

      expanded.add(normalized);

      const collapsed = normalized.replace(/\s+/g, "");
      if (collapsed && collapsed !== normalized) {
        expanded.add(collapsed);
      }

      if (!normalized.endsWith("s") && normalized.length > 3) {
        expanded.add(`${normalized}s`);
      } else if (normalized.endsWith("s")) {
        expanded.add(normalized.replace(/s$/, ""));
      }

      const stem = normalized.replace(/(coes|cao|caoes|ing|ed|mente|mente?s|s|es)$/g, "");
      if (stem.length >= 4) {
        expanded.add(stem);
      }
    });

    acc[subject] = Array.from(expanded);
    return acc;
  }, {});
}

const SUBJECT_KEYWORDS = expandKeywordDictionary(BASE_SUBJECT_KEYWORDS);

const OFF_TOPIC_KEYWORDS = [
  // Culinária e alimentação
  "receita",
  "culinaria",
  "comida",
  "food",
  "recipe",
  "cozinha",
  "ingrediente",
  
  // Esportes e entretenimento
  "futebol",
  "esporte",
  "sport",
  "jogo",
  "game",
  "clube",
  "time",
  "campeonato",
  
  // Política
  "politica",
  "politics",
  "eleicao",
  "election",
  "governo",
  "president",
  "partido",
  
  // Saúde e medicina
  "saude",
  "health",
  "medico",
  "doctor",
  "medicina",
  "doenca",
  "sintoma",
  "remedio",
  "tratamento",
  
  // Clima e meteorologia
  "clima",
  "weather",
  "tempo",
  "temperatura",
  "chuva",
  "previsao",
  
  // Moda e estilo
  "moda",
  "fashion",
  "roupa",
  "clothes",
  "estilo",
  "look",
  
  // Viagem e turismo
  "viagem",
  "travel",
  "turismo",
  "tourism",
  "hotel",
  "passagem",
  "destino",
  
  // RH e carreira (não técnica)
  "entrevista",
  "curriculo",
  "cv",
  "resume",
  "contratar",
  "hiring",
  "recrutamento",
  "recruitment",
  "recursos humanos",
  "salario",
  "beneficio",
  "ferias",
  
  // Finanças pessoais
  "investimento",
  "bolsa",
  "acao",
  "stock",
  "financeiro",
  "dinheiro",
  "money",
  
  // Relacionamentos e vida pessoal
  "namoro",
  "casamento",
  "relacionamento",
  "familia",
  "amigo",
  
  // Educação geral (não técnica)
  "matematica",
  "historia",
  "geografia",
  "literatura",
  "redacao",
  
  // Entretenimento
  "filme",
  "movie",
  "serie",
  "musica",
  "music",
  "livro",
  "book",
  
  // Outros
  "religiao",
  "religion",
  "filosofia",
  "psychology",
  "psicologia",
];

/**
 * Valida se a mensagem está dentro do escopo do assunto escolhido
 * @param {string} message - Mensagem do usuário
 * @param {string} subject - Assunto escolhido (codigo, programacao, dados)
 * @returns {Object} - { isValid: boolean, reason: string }
 */
function validateTopicRelevance(message, subject) {
  const lowerMessage = message.toLowerCase();

  // Verifica se contém palavras claramente fora do tópico
  const hasOffTopicWords = OFF_TOPIC_KEYWORDS.some((keyword) =>
    lowerMessage.includes(keyword)
  );

  if (hasOffTopicWords) {
    return {
      isValid: false,
      reason: `A pergunta parece estar fora do escopo de ${subject}. Faça perguntas relacionadas ao tema escolhido.`,
    };
  }

  // Verifica se contém pelo menos uma palavra-chave do assunto
  const subjectKeywords = SUBJECT_KEYWORDS[subject] || [];
  const hasRelevantKeywords = subjectKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );

  // REGRA MAIS RIGOROSA: Se a mensagem tem mais de 15 caracteres e NÃO tem keywords relevantes, rejeita
  if (message.trim().length >= 15 && !hasRelevantKeywords) {
    return {
      isValid: false,
      reason: `Sua pergunta deve estar relacionada a ${subject}. Inclua termos técnicos relevantes na sua pergunta.`,
    };
  }

  // Se a mensagem for muito curta (< 10 chars) e não tem keywords, pode ser suspeita
  if (message.trim().length < 10 && !hasRelevantKeywords) {
    return {
      isValid: false,
      reason: "Por favor, seja mais específico em sua pergunta.",
    };
  }

  return { isValid: true, reason: null };
}

/**
 * Limita o tamanho da mensagem para evitar uso excessivo de tokens
 * @param {string} message - Mensagem do usuário
 * @param {number} maxLength - Tamanho máximo permitido (padrão: 2000 caracteres)
 * @returns {Object} - { isValid: boolean, reason: string }
 */
function validateMessageLength(message, maxLength = 2000) {
  if (message.length > maxLength) {
    return {
      isValid: false,
      reason: `A mensagem é muito longa. Limite: ${maxLength} caracteres. Atual: ${message.length} caracteres.`,
    };
  }
  return { isValid: true, reason: null };
}

/**
 * Valida padrões suspeitos que podem indicar abuso
 * @param {string} message - Mensagem do usuário
 * @returns {Object} - { isValid: boolean, reason: string }
 */
function validateSuspiciousPatterns(message) {
  // Detecta repetição excessiva de caracteres
  if (/(.)\1{20,}/.test(message)) {
    return {
      isValid: false,
      reason: "Mensagem contém padrões suspeitos.",
    };
  }

  // Detecta tentativas de injection/prompt hacking
  const injectionPatterns = [
    /ignore\s+(all\s+)?previous\s+instructions?/i,
    /disregard\s+(all\s+)?previous\s+instructions?/i,
    /forget\s+(all\s+)?previous\s+instructions?/i,
    /you\s+are\s+now/i,
    /new\s+instructions?:/i,
    /system\s*:\s*you/i,
  ];

  if (injectionPatterns.some((pattern) => pattern.test(message))) {
    return {
      isValid: false,
      reason: "Mensagem contém padrões não permitidos.",
    };
  }

  return { isValid: true, reason: null };
}

/**
 * Aplica todos os guard rails na mensagem
 * @param {string} message - Mensagem do usuário
 * @param {string} subject - Assunto escolhido
 * @returns {Object} - { isValid: boolean, reason: string }
 */
function applyGuardRails(message, subject) {
  // Valida tamanho
  const lengthCheck = validateMessageLength(message);
  if (!lengthCheck.isValid) return lengthCheck;

  // Valida padrões suspeitos
  const suspiciousCheck = validateSuspiciousPatterns(message);
  if (!suspiciousCheck.isValid) return suspiciousCheck;

  // Valida relevância do tópico
  const topicCheck = validateTopicRelevance(message, subject);
  if (!topicCheck.isValid) return topicCheck;

  return { isValid: true, reason: null };
}

module.exports = {
  applyGuardRails,
  validateTopicRelevance,
  validateMessageLength,
  validateSuspiciousPatterns,
};
