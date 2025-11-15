const express = require("express");
const Perplexity = require("@perplexity-ai/perplexity_ai");
const { getMessageContext } = require("./utils/message-context");
const { getSystemMessage } = require("./config/perplexity");
const { SESSION_CONFIG } = require("./config/constants");
const { validateSearchRequest } = require("./middlewares/validator");
const { errorHandler, notFoundHandler } = require("./middlewares/error-handler");

const app = express();

app.use(express.json());

// Inicializa o gerenciador de contexto
const messageContext = getMessageContext(SESSION_CONFIG);

app.post("/search", validateSearchRequest, async (req, res, next) => {
  const { validatedMessage, validatedSubject, selectedModel, sessionId } = req;

  try {
    const client = new Perplexity();

    // Cria ou recupera a sessão
    const userSession = await messageContext.getOrCreateSession(sessionId, validatedSubject);

    // Adiciona a mensagem do sistema apenas se for a primeira mensagem da sessão
    if (userSession.messages.length === 0) {
      const systemMessage = getSystemMessage(validatedSubject);
      await messageContext.addMessage(sessionId, "system", systemMessage.content);
    }

    // Adiciona a mensagem do usuário ao histórico
    await messageContext.addMessage(sessionId, "user", validatedMessage);

    // Recupera o histórico completo para enviar à API
    const conversationHistory = await messageContext.getMessagesForAPI(sessionId);

    const response = await client.chat.completions.create({
      model: selectedModel,
      messages: conversationHistory,
    });

    const content = response.choices[0].message.content;
    const citations = response.citations || [];

    // Adiciona a resposta do assistente ao histórico
    await messageContext.addMessage(sessionId, "assistant", content, { citations });

    res.json({
      sessionId,
      subject: validatedSubject,
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

// Endpoint para listar todas as sessões ativas
app.get("/sessions", async (req, res, next) => {
  try {
    const sessions = await messageContext.listSessions();
    res.json({
      total: sessions.length,
      sessions,
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint para deletar uma sessão específica
app.delete("/session/:sessionId", async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const deleted = await messageContext.deleteSession(sessionId);

    if (!deleted) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ message: "Session deleted successfully", sessionId });
  } catch (error) {
    next(error);
  }
});

// Endpoint para limpar todas as sessões
app.delete("/sessions", async (req, res, next) => {
  try {
    const count = await messageContext.clearAllSessions();
    res.json({ message: "All sessions cleared", count });
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
