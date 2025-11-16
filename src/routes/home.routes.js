const express = require("express");

const router = express.Router();

// Rota principal
router.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Server API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: monospace;
      background: #fff;
      color: #000;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #000;
      padding: 30px;
    }
    .header {
      border-bottom: 2px solid #000;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 16px;
    }
    .section {
      margin-bottom: 30px;
    }
    h2 {
      font-size: 20px;
      margin-bottom: 15px;
      border-bottom: 1px solid #000;
      padding-bottom: 5px;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
    }
    .feature {
      border: 1px solid #000;
      padding: 15px;
      text-align: center;
    }
    .feature strong {
      display: block;
      margin-bottom: 5px;
    }
    .feature-desc {
      font-size: 12px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #000;
      text-align: center;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AI Server API</h1>
      <p class="subtitle">Servidor de IA com Perplexity e Google Gemini</p>
    </div>

    <div class="section">
      <h2>Recursos</h2>
      <div class="features">
        <div class="feature">
          <strong>Múltiplos Modelos</strong>
          <div class="feature-desc">Perplexity & Gemini</div>
        </div>
        <div class="feature">
          <strong>Contexto</strong>
          <div class="feature-desc">Conversação contínua</div>
        </div>
        <div class="feature">
          <strong>Rate Limiting</strong>
          <div class="feature-desc">Proteção integrada</div>
        </div>
        <div class="feature">
          <strong>Sessões</strong>
          <div class="feature-desc">Gerenciamento automático</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Desenvolvido por <a href="https://gaelgomes.dev" target="_blank" rel="noopener noreferrer">Gael Gomes</a></p>
    </div>
  </div>
</body>
</html>
  `);
});

module.exports = router;
