const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DATABASE_HOST_URL,
  port: parseInt(process.env.DATABASE_SERVICE_PORT, 10),
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: false,
    //ca: process.env.SSL_CERTIFICATE,
  },
  max: 20, // Máximo de clientes no pool
  idleTimeoutMillis: 30000, // Cliente pode ficar ocioso por 30s
  connectionTimeoutMillis: 2000, // Tempo máximo para conectar
});

// Tratamento de erros do pool
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("remove", () => {
  console.log("Client removed from pool");
});

const getConnection = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error("Pool connection failed:", error.message);
    throw error;
  }
};

const executeQuery = async (sql, params = []) => {
  const client = await getConnection();
  try {
    const { rows } = await client.query(sql, params);
    return rows;
  } finally {
    client.release();
  }
};

const rowCount = async (sql, params = []) => {
  const client = await getConnection();
  try {
    const result = await client.query(sql, params);
    return result.rowCount;
  } finally {
    client.release();
  }
};

module.exports = { pool, getConnection, executeQuery, rowCount };
