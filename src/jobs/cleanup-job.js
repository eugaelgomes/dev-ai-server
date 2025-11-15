const cron = require("node-cron");
const sessionService = require("../services/session.service");
const { executeQuery } = require("../config/db");

/**
 * Configurações do job de limpeza
 */
const CLEANUP_CONFIG = {
  // Tempo de inatividade em minutos para considerar uma sessão expirada
  SESSION_TIMEOUT_MINUTES: 30,

  // Idade máxima das mensagens em dias
  MESSAGE_RETENTION_DAYS: 7,

  // Executa a cada 30 minutos
  CRON_SCHEDULE: "*/30 * * * *",
};

/**
 * Deleta mensagens antigas (mais de X dias)
 * @param {number} retentionDays - Dias de retenção
 * @returns {Promise<number>} Quantidade de mensagens deletadas
 */
async function deleteOldMessages(
  retentionDays = CLEANUP_CONFIG.MESSAGE_RETENTION_DAYS
) {
  const sql = `
    DELETE FROM aiServerMessages
    WHERE created_at < NOW() - INTERVAL '${retentionDays} days'
    RETURNING id;
  `;

  const rows = await executeQuery(sql);
  return rows.length;
}

/**
 * Deleta sessões inativas e suas mensagens associadas
 * @param {number} timeoutMinutes - Tempo de inatividade em minutos
 * @returns {Promise<Object>} Resultado da limpeza
 */
async function cleanupExpiredSessions(
  timeoutMinutes = CLEANUP_CONFIG.SESSION_TIMEOUT_MINUTES
) {
  try {
    // Deleta sessões inativas (o CASCADE vai deletar as mensagens associadas)
    const deletedSessions =
      await sessionService.cleanExpiredSessions(timeoutMinutes);

    // Deleta mensagens antigas órfãs (caso existam)
    const deletedMessages = await deleteOldMessages();

    return {
      success: true,
      deletedSessions,
      deletedMessages,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erro ao limpar sessões expiradas:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Executa o job de limpeza
 */
async function runCleanupJob() {
  console.log(
    `[Cleanup Job] Iniciando limpeza de dados - ${new Date().toISOString()}`
  );

  const result = await cleanupExpiredSessions();

  if (result.success) {
    console.log(
      `[Cleanup Job] Limpeza concluída - ` +
        `${result.deletedSessions} sessões e ${result.deletedMessages} mensagens removidas`
    );
  } else {
    console.error(`[Cleanup Job] Falha na limpeza: ${result.error}`);
  }

  return result;
}

/**
 * Inicializa o job de limpeza com agendamento via cron
 */
function startCleanupJob() {
  console.log(
    `[Cleanup Job] Agendando job de limpeza (cron: ${CLEANUP_CONFIG.CRON_SCHEDULE})`
  );
  console.log(
    `[Cleanup Job] Timeout de sessão: ${CLEANUP_CONFIG.SESSION_TIMEOUT_MINUTES} minutos`
  );
  console.log(
    `[Cleanup Job] Retenção de mensagens: ${CLEANUP_CONFIG.MESSAGE_RETENTION_DAYS} dias`
  );

  // Agenda o job para rodar a cada 30 minutos
  const task = cron.schedule(CLEANUP_CONFIG.CRON_SCHEDULE, runCleanupJob, {
    scheduled: true,
    timezone: "America/Sao_Paulo",
  });

  // Executa imediatamente na inicialização (opcional)
  // runCleanupJob();

  return task;
}

/**
 * Para o job de limpeza
 * @param {Object} task - Task do cron
 */
function stopCleanupJob(task) {
  if (task) {
    task.stop();
    console.log("[Cleanup Job] Job de limpeza parado");
  }
}

module.exports = {
  startCleanupJob,
  stopCleanupJob,
  runCleanupJob,
  cleanupExpiredSessions,
  CLEANUP_CONFIG,
};
