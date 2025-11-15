const express = require("express");

// -- Perplexity AI e Gemini --
const Perplexity = require("@perplexity-ai/perplexity_ai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// -- Utilitários e Middlewares --
const { getMessageContext } = require("./utils/message-context");
const { getSystemMessage: getPerplexitySystemMessage } = require("./config/perplexity");
const { getSystemMessage: getGeminiSystemMessage } = require("./config/gemini");
const { SESSION_CONFIG } = require("./config/constants");
const { validateSearchRequest } = require("./middlewares/validator");
const { errorHandler, notFoundHandler } = require("./middlewares/error-handler");
const { generalLimiter, searchLimiter } = require("./middlewares/rate-limit");

const app = express();

app.use(express.json());

// Aplica rate limit geral a todas as rotas
app.use(generalLimiter);

// Inicializa o gerenciador de contexto
const messageContext = getMessageContext(SESSION_CONFIG);

// Rota principal
app.get("/", (req, res) => {
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
    .endpoint {
      background: #f0f0f0;
      border: 1px solid #000;
      padding: 15px;
      margin-bottom: 10px;
    }
    .method {
      display: inline-block;
      padding: 2px 8px;
      background: #000;
      color: #fff;
      font-weight: bold;
      font-size: 12px;
      margin-right: 10px;
    }
    .path {
      font-weight: bold;
    }
    .description {
      margin-top: 8px;
      font-size: 14px;
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
      <p>Desenvolvido por Gael Gomes</p>
    </div>
  </div>
</body>
</html>
  `);
});

app.post("/search", searchLimiter, validateSearchRequest, async (req, res, next) => {
  const { validatedMessage, validatedSubjects, selectedModel, selectedProvider, sessionId } = req;

  try {
    // Cria ou recupera a sessão (salva os subjects como string separada por vírgula)
    const subjectsString = validatedSubjects.join(",");
    const userSession = await messageContext.getOrCreateSession(sessionId, subjectsString);

    // Adiciona a mensagem do sistema apenas se for a primeira mensagem da sessão
    if (userSession.messages.length === 0) {
      const systemMessage = selectedProvider === "gemini" 
        ? getGeminiSystemMessage(validatedSubjects)
        : getPerplexitySystemMessage(validatedSubjects);
      await messageContext.addMessage(sessionId, "system", systemMessage.content);
    }

    // Adiciona a mensagem do usuário ao histórico
    await messageContext.addMessage(sessionId, "user", validatedMessage);

    // Recupera o histórico completo para enviar à API
    const conversationHistory = await messageContext.getMessagesForAPI(sessionId);

    let content, citations = [];

    if (selectedProvider === "gemini") {
      // Usando Gemini
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      
      // Prepara a systemInstruction no formato correto
      const systemInstructionContent = conversationHistory.find(msg => msg.role === "system")?.content;
      const systemInstruction = systemInstructionContent ? {
        parts: [{ text: systemInstructionContent }],
        role: "user"
      } : undefined;

      const model = genAI.getGenerativeModel({ 
        model: selectedModel,
        systemInstruction
      });

      // Converte o histórico para o formato do Gemini
      const geminiHistory = conversationHistory
        .filter(msg => msg.role !== "system") // Gemini usa systemInstruction separado
        .map(msg => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }));

      const chat = model.startChat({
        history: geminiHistory.slice(0, -1), // Remove a última mensagem (current)
      });

      const result = await chat.sendMessage(validatedMessage);
      content = result.response.text();
    } else {
      // Usando Perplexity
      const client = new Perplexity();
      const response = await client.chat.completions.create({
        model: selectedModel,
        messages: conversationHistory,
      });

      content = response.choices[0].message.content;
      citations = response.citations || [];
    }

    // Adiciona a resposta do assistente ao histórico
    await messageContext.addMessage(sessionId, "assistant", content, { citations });

    res.json({
      sessionId,
      subjects: validatedSubjects,
      provider: selectedProvider,
      message: validatedMessage,
      model: selectedModel,
      content,
      citations,
      messageCount: userSession.messages.length,
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint para obter informações de uma sessão
app.get("/session/:sessionId", async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const sessionInfo = await messageContext.getSessionInfo(sessionId);

    if (!sessionInfo) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(sessionInfo);
  } catch (error) {
    next(error);
  }
});

// Endpoint de saúde
app.get("/health", async (req, res, next) => {
  try {
    const activeSessions = await messageContext.getActiveSessionCount();
    res.json({
      status: "ok",
      activeSessions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Handler para rotas não encontradas
app.use(notFoundHandler);

// Handler global de erros
app.use(errorHandler);

module.exports = app;
