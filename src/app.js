const express = require("express");
const routes = require("./routes/index.routes");
const { generalLimiter } = require("./middlewares/rate-limit");
const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/error-handler");

const app = express();

// Middlewares principais
const baseMiddlewares = [express.json(), generalLimiter];

// Middlewares finais
const finalMiddlewares = [notFoundHandler, errorHandler];

app.use(baseMiddlewares);
app.use("/api", routes);
app.use(finalMiddlewares);

module.exports = app;
