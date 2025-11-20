const sessionService = require("../services/db/session.service");
const messageService = require("../services/db/message.service");

/**
 * Gerenciador de contexto e histórico de mensagens
 * Agora com persistência em banco de dados
 */

class MessageContext {
  constructor(options = {}) {
    // Cache em memória para sessões ativas
    this.conversations = new Map();

    // Configurações
    this.maxMessagesPerSession = options.maxMessagesPerSession || 20;
    this.sessionTimeout = options.sessionTimeout || 30 * 60 * 1000; // 30 minutos padrão
    this.useDatabase = options.useDatabase !== false; // Ativa DB por padrão
  }

  /**
   * Remove sessões que expiraram (memória e banco)
   */
  async cleanExpiredSessions() {
    const now = Date.now();
    let cleanedCount = 0;

    // Limpa sessões em memória
    for (const [sessionId, session] of this.conversations.entries()) {
      if (now - session.lastActivity > this.sessionTimeout) {
        this.conversations.delete(sessionId);
        cleanedCount++;
      }
    }

    // Limpa sessões no banco de dados
    if (this.useDatabase) {
      try {
        const dbCleaned = await sessionService.cleanExpiredSessions(
          this.sessionTimeout / (60 * 1000) // Converte para minutos
        );
        cleanedCount += dbCleaned;
      } catch (error) {
        console.error(
          "Error cleaning expired sessions from database:",
          error.message
        );
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned ${cleanedCount} expired session(s)`);
    }
  }

  /**
   * Cria ou recupera uma sessão (memória e banco)
   * @param {string} sessionId - ID da sessão
   * @param {string} subject - Assunto da conversa
   * @returns {Promise<Object>} Sessão
   */
  async getOrCreateSession(sessionId, subject) {
    // Persiste no banco de dados
    if (this.useDatabase) {
      try {
        await sessionService.upsertSession(sessionId, subject);
      } catch (error) {
        console.error("Error upserting session to database:", error.message);
      }
    }

    // Mantém cache em memória para performance
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, {
        id: sessionId,
        subject,
        messages: [],
        createdAt: Date.now(),
        lastActivity: Date.now(),
      });
    }

    const session = this.conversations.get(sessionId);
    session.lastActivity = Date.now();

    return session;
  }

  /**
   * Adiciona uma mensagem ao histórico (memória e banco)
   * @param {string} sessionId - ID da sessão
   * @param {string} role - Papel (user, assistant, system)
   * @param {string} content - Conteúdo da mensagem
   * @param {Object} metadata - Metadados adicionais (opcional)
   */
  async addMessage(sessionId, role, content, metadata = {}) {
    const session = this.conversations.get(sessionId);

    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Persiste no banco de dados
    if (this.useDatabase) {
      try {
        await messageService.addMessage(sessionId, role, content, metadata);

        // Limita mensagens no banco
        const messageCount = await messageService.countMessages(sessionId);
        if (messageCount > this.maxMessagesPerSession) {
          await messageService.trimMessages(
            sessionId,
            this.maxMessagesPerSession
          );
        }
      } catch (error) {
        console.error("Error adding message to database:", error.message);
      }
    }

    // Mantém em memória
    const message = {
      role,
      content,
      timestamp: Date.now(),
      ...metadata,
    };

    session.messages.push(message);

    // Limita o número de mensagens mantendo as mais recentes
    if (session.messages.length > this.maxMessagesPerSession) {
      const systemMessage = session.messages.find((m) => m.role === "system");
      const recentMessages = session.messages
        .filter((m) => m.role !== "system")
        .slice(-this.maxMessagesPerSession + (systemMessage ? 1 : 0));

      session.messages = systemMessage
        ? [systemMessage, ...recentMessages]
        : recentMessages;
    }

    session.lastActivity = Date.now();
  }

  /**
   * Retorna o histórico de mensagens formatado para a API
   * Tenta buscar do banco se não estiver em memória
   * @param {string} sessionId - ID da sessão
   * @param {boolean} includeSystem - Se deve incluir mensagem do sistema
   * @returns {Promise<Array>} Array de mensagens formatadas
   */
  async getMessagesForAPI(sessionId, includeSystem = true) {
    const session = this.conversations.get(sessionId);

    // Se tiver em memória, usa
    if (session && session.messages.length > 0) {
      return session.messages
        .filter((m) => includeSystem || m.role !== "system")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));
    }

    // Caso contrário, busca do banco
    if (this.useDatabase) {
      try {
        return await messageService.getMessagesForAPI(
          sessionId,
          this.maxMessagesPerSession,
          includeSystem
        );
      } catch (error) {
        console.error("Error fetching messages from database:", error.message);
      }
    }

    return [];
  }

  /**
   * Retorna informações sobre uma sessão
   * @param {string} sessionId - ID da sessão
   * @returns {Promise<Object|null>} Informações da sessão
   */
  async getSessionInfo(sessionId) {
    // Tenta buscar do banco primeiro
    if (this.useDatabase) {
      try {
        const sessionInfo = await sessionService.getSession(sessionId);
        if (sessionInfo) {
          return {
            id: sessionInfo.session_id,
            subject: sessionInfo.subject,
            messageCount: parseInt(sessionInfo.message_count, 10),
            createdAt: new Date(sessionInfo.created_at).getTime(),
            lastActivity: new Date(sessionInfo.last_activity).getTime(),
          };
        }
      } catch (error) {
        console.error("Error fetching session from database:", error.message);
      }
    }

    // Fallback para memória
    const session = this.conversations.get(sessionId);

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      subject: session.subject,
      messageCount: session.messages.length,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
    };
  }

  /**
   * Lista todas as sessões ativas
   * @returns {Promise<Array>} Array com informações das sessões
   */
  async listSessions() {
    // Busca do banco se disponível
    if (this.useDatabase) {
      try {
        const sessions = await sessionService.listSessions();
        return sessions.map((s) => ({
          id: s.session_id,
          subject: s.subject,
          messageCount: parseInt(s.message_count, 10),
          createdAt: new Date(s.created_at).getTime(),
          lastActivity: new Date(s.last_activity).getTime(),
        }));
      } catch (error) {
        console.error("Error listing sessions from database:", error.message);
      }
    }

    // Fallback para memória
    return Array.from(this.conversations.values()).map((session) => ({
      id: session.id,
      subject: session.subject,
      messageCount: session.messages.length,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
    }));
  }

  /**
   * Remove uma sessão específica
   * @param {string} sessionId - ID da sessão
   * @returns {Promise<boolean>} true se removeu, false se não encontrou
   */
  async deleteSession(sessionId) {
    let deleted = false;

    // Remove do banco
    if (this.useDatabase) {
      try {
        deleted = await sessionService.deleteSession(sessionId);
      } catch (error) {
        console.error("Error deleting session from database:", error.message);
      }
    }

    // Remove da memória
    const memoryDeleted = this.conversations.delete(sessionId);

    return deleted || memoryDeleted;
  }

  /**
   * Limpa todas as sessões
   * @returns {number} Quantidade de sessões removidas
   */
  clearAllSessions() {
    let totalCount = 0;

    // Limpa do banco (não implementado no service, apenas memória por segurança)
    // Se quiser limpar tudo do banco, implemente sessionService.clearAll()

    // Limpa da memória
    totalCount = this.conversations.size;
    this.conversations.clear();

    return totalCount;
  }

  /**
   * Retorna o número de sessões ativas
   * @returns {Promise<number>}
   */
  async getActiveSessionCount() {
    // Busca do banco se disponível
    if (this.useDatabase) {
      try {
        return await sessionService.getActiveSessionCount();
      } catch (error) {
        console.error("Error counting sessions from database:", error.message);
      }
    }

    // Fallback para memória
    return this.conversations.size;
  }
}

// Instância singleton
let instance = null;

/**
 * Retorna a instância do gerenciador de contexto
 * @param {Object} options - Opções de configuração
 * @returns {MessageContext}
 */
function getMessageContext(options = {}) {
  if (!instance) {
    instance = new MessageContext(options);
  }
  return instance;
}

module.exports = {
  MessageContext,
  getMessageContext,
};
