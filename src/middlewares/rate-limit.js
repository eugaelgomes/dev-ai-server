const rateLimit = require("express-rate-limit");

// Rate limiter geral para todas as requisições
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // Limite de 100 requisições por IP
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true, // Retorna info de rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message:
        "You have exceeded the maximum number of requests. Please try again later.",
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

// Rate limiter específico para o endpoint de busca (mais restritivo)
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // Limite de 5 requisições por minuto
  message: {
    error: "Too many search requests, please slow down.",
    retryAfter: "1 minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Conta todas as requisições
  handler: (req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      message:
        "You are making too many search requests. Please wait before trying again.",
      retryAfter: req.rateLimit.resetTime,
      limit: req.rateLimit.limit,
      remaining: req.rateLimit.remaining,
    });
  },
});

// Rate limiter para criação de sessões
const sessionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 30, // Limite de 50 sessões por hora
  message: {
    error: "Too many sessions created, please try again later.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Session creation limit exceeded",
      message: "You have created too many sessions. Please try again later.",
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

module.exports = {
  generalLimiter,
  searchLimiter,
  sessionLimiter,
};
