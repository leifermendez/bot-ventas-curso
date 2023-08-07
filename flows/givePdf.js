const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

/**
 *
 * @returns
 */
const flowPDF = () =>
  addKeyword(EVENTS.DOCUMENT).addAnswer(
    "la memoria de mi celular esta llena no puedo recibir mas archivos..intenta con una nota de voz"
  );

module.exports = { flowPDF };
