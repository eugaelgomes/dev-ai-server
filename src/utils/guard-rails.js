const BASE_SUBJECT_KEYWORDS = require("./library/base-subject");
const OFF_TOPIC_KEYWORDS = require("./library/off-topic");

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
  if (!text) {
    return "";
  }

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[0-9]/g, (digit) => DIGIT_TO_LETTER[digit] || digit)
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandKeywordDictionary(dictionary) {
  return Object.entries(dictionary).reduce((acc, [subject, keywords]) => {
    const expanded = new Set();

    keywords.forEach((keyword) => {
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

      const stem = normalized.replace(
        /(coes|cao|caoes|ing|ed|mente|mente?s|s|es)$/g,
        ""
      );
      if (stem.length >= 4) {
        expanded.add(stem);
      }
    });

    acc[subject] = Array.from(expanded);
    return acc;
  }, {});
}

const SUBJECT_KEYWORDS = expandKeywordDictionary(BASE_SUBJECT_KEYWORDS);

// Normaliza palavras fora de tópico uma vez para matching consistente
const NORMALIZED_OFF_TOPIC_KEYWORDS =
  OFF_TOPIC_KEYWORDS.map(normalizeText).filter(Boolean);

function wordBoundaryIncludes(message, keyword) {
  if (!keyword) {
    return false;
  }
  // mensagem já normalizada; keywords também normalizadas
  const pattern = new RegExp(`\\b${keyword}\\b`);
  return pattern.test(message);
}

/**
 * Valida se a mensagem está dentro do escopo do assunto escolhido
 * @param {string} message - Mensagem do usuário
 * @param {string} subject - Assunto escolhido (codigo, programacao, dados)
 * @returns {Object} - { isValid: boolean, reason: string }
 */
function validateTopicRelevance(message, subject) {
  // Normaliza a mensagem para alinhar com o dicionário expandido
  const normalizedMessage = normalizeText(message);

  // Verifica se contém palavras claramente fora do tópico (normalizadas)
  const hasOffTopicWords = NORMALIZED_OFF_TOPIC_KEYWORDS.some((keyword) =>
    wordBoundaryIncludes(normalizedMessage, keyword)
  );

  if (hasOffTopicWords) {
    return {
      isValid: false,
      reason: `A pergunta parece estar fora do escopo de ${subject}. Faça perguntas relacionadas ao tema escolhido.`,
    };
  }

  // Verifica se contém pelo menos uma palavra-chave do assunto (normalizada)
  const subjectKeywords = SUBJECT_KEYWORDS[subject] || [];
  const hasRelevantKeywords = subjectKeywords.some((keyword) =>
    wordBoundaryIncludes(normalizedMessage, keyword)
  );

  // Regra suavizada: não bloquear mensagens medianas/longas sem keywords
  // Mantemos apenas uma exigência mínima para mensagens muito curtas

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
  if (!lengthCheck.isValid) {
    return lengthCheck;
  }

  // Valida padrões suspeitos
  const suspiciousCheck = validateSuspiciousPatterns(message);
  if (!suspiciousCheck.isValid) {
    return suspiciousCheck;
  }

  // Valida relevância do tópico
  const topicCheck = validateTopicRelevance(message, subject);
  if (!topicCheck.isValid) {
    return topicCheck;
  }

  return { isValid: true, reason: null };
}

module.exports = {
  applyGuardRails,
  validateTopicRelevance,
  validateMessageLength,
  validateSuspiciousPatterns,
};
