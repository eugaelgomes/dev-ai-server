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
    // Português
    "codigo",
    "codificacao",
    "codificar",
    "codar",
    "bug",
    "debug",
    "git",
    "github",
    "commit",
    "branch",
    "merge",
    "pull request",
    "repository",
    "repositorio",
    "versao",
    "refactor",
    "refatorar",
    "clean code",
    "design pattern",
    "padroes de projeto",
    "solid",
    "api",
    "rest",
    "graphql",
    "microservices",
    "microsservicos",
    "deploy",
    "ci/cd",
    "cicd",
    "devops",
    "docker",
    "kubernetes",
    "container",
    "infra",
    "infraestrutura",
    "arquitetura",
    "teste",
    "unit test",
    "teste unitario",
    "integration",
    "integracao",
    "integration test",
    "teste de integracao",
    "tdd",
    "bdd",
    "lint",
    "prettier",
    "eslint",
    "webpack",
    "build",
    "compilacao",
    "compilation",
    "source",
    "fork",
    "clone",
    "push",
    "pull",
    "pullrequest",
    "merge request",
    "review",
    "revisao",
    "code review",
    "revisao de codigo",
    "pr",
    "pipeline",
    "ci",
    "cd",
    "rollback",
    // English
    "code",
    "coding",
    "version",
    "architecture",
    "test",
    "testing",
    "infrastructure",
    "deployment",
  ],
  programacao: [
    // Português
    "programacao",
    "programacoes",
    "programador",
    "programadora",
    "programar",
    "javascript",
    "python",
    "java",
    "typescript",
    "node",
    "nodejs",
    "react",
    "angular",
    "vue",
    "function",
    "funcao",
    "funcoes",
    "classe",
    "class",
    "js",
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
    "numero",
    "boolean",
    "booleano",
    "type",
    "tipo",
    "interface",
    "generic",
    "generico",
    "enum",
    "enumeracao",
    "struct",
    "estrutura",
    "pointer",
    "ponteiro",
    "memory",
    "memoria",
    "stack",
    "pilha",
    "heap",
    "recursion",
    "recursao",
    "iteration",
    "iteracao",
    "sorting",
    "ordenacao",
    "search",
    "busca",
    "binary",
    "binario",
    "hash",
    "tree",
    "arvore",
    "graph",
    "grafo",
    "linked list",
    "lista encadeada",
    "linkedlist",
    "queue",
    "fila",
    "map",
    "mapa",
    "set",
    "conjunto",
    "compiler",
    "compilador",
    "interpreter",
    "interpretador",
    "runtime",
    "framework",
    "library",
    "biblioteca",
    "package",
    "pacote",
    "module",
    "modulo",
    "import",
    "importar",
    "export",
    "exportar",
    "dependency",
    "dependencia",
    "npm",
    "pip",
    "maven",
    "gradle",
    "ide",
    "editor",
    "debugger",
    "depurador",
    // English
    "programming",
    "coding",
    "developer",
    "coder",
    "functions",
    "classes",
    "methods",
    "variables",
    "objects",
    "algorithms",
    "types",
    "interfaces",
    "generics",
    "enums",
    "structures",
    "pointers",
    "recursions",
    "iterations",
    "searches",
    "trees",
    "graphs",
    "queues",
    "maps",
    "sets",
    "libraries",
    "packages",
    "modules",
    "dependencies",
  ],
  dados: [
    // Português
    "dados",
    "dado",
    "data",
    "database",
    "banco",
    "banco de dados",
    "sql",
    "sqlserver",
    "nosql",
    "mongodb",
    "postgres",
    "postgresql",
    "mysql",
    "sqlite",
    "query",
    "consulta",
    "tabela",
    "table",
    "analytics",
    "analitica",
    "analise",
    "dashboard",
    "painel",
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
    "aprendizado de maquina",
    "dataset",
    "conjunto de dados",
    "training",
    "treinamento",
    "model",
    "modelo",
    "neural",
    "deep learning",
    "aprendizado profundo",
    "ai",
    "artificial intelligence",
    "inteligencia artificial",
    "ia",
    "regression",
    "regressao",
    "classification",
    "classificacao",
    "clustering",
    "agrupamento",
    "feature",
    "caracteristica",
    "label",
    "rotulo",
    "predict",
    "prever",
    "predicao",
    "bigquery",
    "redshift",
    "snowflake",
    "spark",
    "hadoop",
    "hive",
    "kafka",
    "stream",
    "streaming",
    "transmissao",
    "batch",
    "lote",
    "warehouse",
    "armazem",
    "lake",
    "lago",
    "schema",
    "esquema",
    "index",
    "indice",
    "join",
    "juncao",
    "aggregate",
    "agregacao",
    "group by",
    "agrupar",
    "partition",
    "particao",
    "normalization",
    "normalizacao",
    "denormalization",
    "desnormalizacao",
    "databricks",
    "lakehouse",
    "powerbi",
    "bi",
    "metadado",
    "metadata",
    // English
    "databases",
    "tables",
    "queries",
    "dashboards",
    "reports",
    "analysis",
    "models",
    "predictions",
    "features",
    "labels",
    "clusters",
    "regressions",
    "classifications",
    "indexes",
    "joins",
    "aggregates",
    "partitions",
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
  // Culinária e alimentação (PT + EN)
  "receita",
  "culinaria",
  "comida",
  "food",
  "recipe",
  "cozinha",
  "kitchen",
  "ingrediente",
  "ingredient",
  "cozinhar",
  "cooking",
  "prato",
  "dish",
  "refeicao",
  "meal",
  
  // Esportes e entretenimento (PT + EN)
  "futebol",
  "football",
  "soccer",
  "esporte",
  "sport",
  "jogo",
  "game",
  "clube",
  "club",
  "time",
  "team",
  "campeonato",
  "championship",
  "partida",
  "match",
  "jogador",
  "player",
  
  // Política (PT + EN)
  "politica",
  "politics",
  "eleicao",
  "election",
  "governo",
  "government",
  "president",
  "presidente",
  "partido",
  "party",
  "deputado",
  "senador",
  "voto",
  "vote",
  
  // Saúde e medicina (PT + EN)
  "saude",
  "health",
  "medico",
  "doctor",
  "medicina",
  "medicine",
  "doenca",
  "disease",
  "sintoma",
  "symptom",
  "remedio",
  "remedy",
  "tratamento",
  "treatment",
  "hospital",
  "clinica",
  "clinic",
  
  // Clima e meteorologia (PT + EN)
  "clima",
  "climate",
  "weather",
  "tempo",
  "temperatura",
  "temperature",
  "chuva",
  "rain",
  "previsao",
  "forecast",
  "sol",
  "sun",
  "nuvem",
  "cloud",
  
  // Moda e estilo (PT + EN)
  "moda",
  "fashion",
  "roupa",
  "clothes",
  "clothing",
  "estilo",
  "style",
  "look",
  "vestido",
  "dress",
  "sapato",
  "shoe",
  
  // Viagem e turismo (PT + EN)
  "viagem",
  "travel",
  "trip",
  "turismo",
  "tourism",
  "hotel",
  "passagem",
  "ticket",
  "destino",
  "destination",
  "voo",
  "flight",
  
  // RH e carreira (não técnica) (PT + EN)
  "entrevista",
  "interview",
  "curriculo",
  "cv",
  "resume",
  "contratar",
  "hire",
  "hiring",
  "recrutamento",
  "recruitment",
  "recursos humanos",
  "human resources",
  "salario",
  "salary",
  "beneficio",
  "benefit",
  "ferias",
  "vacation",
  "holidays",
  
  // Finanças pessoais (PT + EN)
  "investimento",
  "investment",
  "bolsa",
  "acao",
  "stock",
  "financeiro",
  "financial",
  "dinheiro",
  "money",
  "emprestimo",
  "loan",
  "credito",
  "credit",
  
  // Relacionamentos e vida pessoal (PT + EN)
  "namoro",
  "dating",
  "casamento",
  "marriage",
  "wedding",
  "relacionamento",
  "relationship",
  "familia",
  "family",
  "amigo",
  "friend",
  "amor",
  "love",
  
  // Educação geral (não técnica) (PT + EN)
  "matematica",
  "mathematics",
  "math",
  "historia",
  "history",
  "geografia",
  "geography",
  "literatura",
  "literature",
  "redacao",
  "essay",
  "writing",
  
  // Entretenimento (PT + EN)
  "filme",
  "movie",
  "film",
  "serie",
  "series",
  "show",
  "musica",
  "music",
  "livro",
  "book",
  "novela",
  "soap opera",
  
  // Outros (PT + EN)
  "religiao",
  "religion",
  "filosofia",
  "philosophy",
  "psychology",
  "psicologia",
  "astrologia",
  "astrology",
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
