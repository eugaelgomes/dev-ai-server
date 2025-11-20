const { executeQuery } = require("./db");

/**
 * Serviço de gerenciamento de mensagens no banco de dados
 */
class MessageService {
  /**
   * Adiciona uma mensagem ao histórico
   * @param {string} sessionId - ID da sessão
   * @param {string} role - Papel (system, user, assistant)
   * @param {string} content - Conteúdo da mensagem
   * @param {Object} metadata - Metadados adicionais
   * @returns {Promise<Object>} Mensagem criada
   */
  async addMessage(sessionId, role, content, metadata = {}) {
    const sql = `
      INSERT INTO aiServerMessages (session_id, role, content, metadata, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;

    const rows = await executeQuery(sql, [
      sessionId,
      role,
      content,
      JSON.stringify(metadata),
    ]);

    return rows[0];
  }

  /**
   * Busca mensagens de uma sessão
   * @param {string} sessionId - ID da sessão
   * @param {number} limit - Limite de mensagens (padrão: 20)
   * @returns {Promise<Array>} Lista de mensagens
   */
  async getMessages(sessionId, limit = 20) {
    const sql = `
      SELECT id, session_id, role, content, metadata, created_at
      FROM aiServerMessages
      WHERE session_id = $1
      ORDER BY created_at DESC
      LIMIT $2;
    `;

    const rows = await executeQuery(sql, [sessionId, limit]);
    return rows.reverse(); // Retorna na ordem cronológica
  }

  /**
   * Formata mensagens para envio à API do Perplexity
   * @param {string} sessionId - ID da sessão
   * @param {number} limit - Limite de mensagens
   * @param {boolean} includeSystem - Se deve incluir mensagem do sistema
   * @returns {Promise<Array>} Array de mensagens formatadas
   */
  async getMessagesForAPI(sessionId, limit = 20, includeSystem = true) {
    const messages = await this.getMessages(sessionId, limit);

    return messages
      .filter((m) => includeSystem || m.role !== "system")
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));
  }

  /**
   * Conta mensagens de uma sessão
   * @param {string} sessionId - ID da sessão
   * @returns {Promise<number>} Número de mensagens
   */
  async countMessages(sessionId) {
    const sql =
      "SELECT COUNT(*) as count FROM aiServerMessages WHERE session_id = $1;";
    const rows = await executeQuery(sql, [sessionId]);
    return parseInt(rows[0].count, 10);
  }

  /**
   * Remove mensagens antigas de uma sessão, mantendo apenas as N mais recentes
   * @param {string} sessionId - ID da sessão
   * @param {number} keepCount - Quantidade de mensagens a manter
   * @returns {Promise<number>} Quantidade de mensagens removidas
   */
  async trimMessages(sessionId, keepCount = 20) {
    const sql = `
      DELETE FROM aiServerMessages
      WHERE session_id = $1
        AND id NOT IN (
          SELECT id FROM aiServerMessages
          WHERE session_id = $1
          ORDER BY created_at DESC
          LIMIT $2
        )
      RETURNING id;
    `;

    const rows = await executeQuery(sql, [sessionId, keepCount]);
    return rows.length;
  }
}

module.exports = new MessageService();
