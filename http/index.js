const express = require("express");
const app = express();

const PORT = process.env.PORT ?? 4000;

/**
 * Clase de API REST
 */
class ServerAPI {
  providerWS;
  constructor(_providerWS) {
    this.providerWS = _providerWS;
  }

  start() {
    app.use("/api", require("./routes"));
    app.listen(PORT, () => `http://localhost:${PORT}`);
  }
}

module.exports = ServerAPI;
