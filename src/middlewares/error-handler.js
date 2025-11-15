/**
 * Middleware global de tratamento de erros
 */
function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  // Se a resposta já foi enviada, delega para o handler padrão do Express
  if (res.headersSent) {
    return next(err);
  }

  // Determina o status code
  const statusCode = err.statusCode || err.status || 500;

  // Resposta de erro
  res.status(statusCode).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { 
      stack: err.stack,
      details: err.details 
    }),
  });
}

/**
 * Handler para rotas não encontradas (404)
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
