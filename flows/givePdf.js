const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

/**
 *
 * @returns
 */
const flowPDF = (globalState) =>
  addKeyword(EVENTS.DOCUMENT)
    .addAction((_, { endFlow }) => {
      if (!globalState.status) {
        return endFlow();
      }
    })
    .addAnswer(
      "la memoria de mi celular esta llena no puedo recibir mas archivos..intenta con una nota de voz"
    );

module.exports = { flowPDF };
