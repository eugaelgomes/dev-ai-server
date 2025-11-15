const { executeQuery, rowCount } = require("../config/db");

/**
 * Serviço de gerenciamento de sessões no banco de dados
 */
class SessionService {
  /**
   * Cria ou atualiza uma sessão no banco
   * @param {string} sessionId - ID da sessão
   * @param {string} subject - Assunto da sessão
   * @returns {Promise<Object>} Sessão criada/atualizada
   */
  async upsertSession(sessionId, subject) {
    const sql = `
      INSERT INTO aiSessions (session_id, subject, created_at, last_activity)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (session_id)
      DO UPDATE SET last_activity = NOW()
      RETURNING *;
    `;
    
    const rows = await executeQuery(sql, [sessionId, subject]);
    return rows[0];
  }

  /**
   * Busca uma sessão pelo ID
   * @param {string} sessionId - ID da sessão
   * @returns {Promise<Object|null>} Sessão encontrada ou null
   */
  async getSession(sessionId) {
    const sql = `
      SELECT session_id, subject, created_at, last_activity,
             (SELECT COUNT(*) FROM aiServerMessages WHERE session_id = $1) as message_count
      FROM aiSessions
      WHERE session_id = $1;
    `;
    
    const rows = await executeQuery(sql, [sessionId]);
    return rows[0] || null;
  }

  /**
   * Lista todas as sessões ativas
   * @param {number} limit - Limite de resultados
   * @returns {Promise<Array>} Lista de sessões
   */
  async listSessions(limit = 100) {
    const sql = `
      SELECT s.session_id, s.subject, s.created_at, s.last_activity,
             COUNT(m.id) as message_count
      FROM aiSessions s
      LEFT JOIN aiServerMessages m ON s.session_id = m.session_id
      GROUP BY s.session_id, s.subject, s.created_at, s.last_activity
      ORDER BY s.last_activity DESC
      LIMIT $1;
    `;
    
    return await executeQuery(sql, [limit]);
  }

  /**
   * Deleta uma sessão e suas mensagens
   * @param {string} sessionId - ID da sessão
   * @returns {Promise<boolean>} true se deletou, false se não encontrou
   */
  async deleteSession(sessionId) {
    const sql = `DELETE FROM aiSessions WHERE session_id = $1;`;
    const count = await rowCount(sql, [sessionId]);
    return count > 0;
  }

  /**
   * Limpa sessões inativas há mais de X minutos
   * @param {number} timeoutMinutes - Tempo de inatividade em minutos
   * @returns {Promise<number>} Quantidade de sessões removidas
   */
  async cleanExpiredSessions(timeoutMinutes = 30) {
    const sql = `
      DELETE FROM aiSessions
      WHERE last_activity < NOW() - INTERVAL '${timeoutMinutes} minutes'
      RETURNING session_id;
    `;
    
    const rows = await executeQuery(sql);
    return rows.length;
  }

  /**
   * Conta sessões ativas
   * @returns {Promise<number>} Número de sessões ativas
   */
  async getActiveSessionCount() {
    const sql = `SELECT COUNT(*) as count FROM aiSessions;`;
    const rows = await executeQuery(sql);
    return parseInt(rows[0].count, 10);
  }
}

module.exports = new SessionService();
