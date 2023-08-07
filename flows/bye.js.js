const { addKeyword } = require("@bot-whatsapp/bot");

/**
 *
 * @returns
 */
const flowAdios = () =>
  addKeyword(["adios", "bye", "chao"]).addAnswer("Nos vemos!");

module.exports = { flowAdios };
