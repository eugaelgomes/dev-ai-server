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
  // Se aceita HTML, retorna página HTML
  if (req.accepts('html')) {
    return res.status(404).send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Página Não Encontrada | AI Server</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: monospace;
      background: #fff;
      color: #000;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      border: 2px solid #000;
      padding: 40px;
    }
    .error-code {
      font-size: 72px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      margin-bottom: 20px;
      line-height: 1.5;
    }
    .path {
      background: #f0f0f0;
      padding: 10px;
      border: 1px solid #000;
      margin-bottom: 20px;
      word-break: break-all;
    }
    .links {
      margin-top: 20px;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      background: #000;
      color: #fff;
      text-decoration: none;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .btn:hover {
      background: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error-code">404</div>
    <h1>Página Não Encontrada</h1>
    <p>A rota que você está procurando não existe no servidor.</p>
    <div class="path">Caminho: ${req.path}</div>
    <div class="links">
      <a href="/" class="btn">Página Inicial</a>
      <a href="/health" class="btn">Status</a>
    </div>
  </div>
</body>
</html>
    `);
  }
  
  // Caso contrário, retorna JSON
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
