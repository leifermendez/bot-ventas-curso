const { addKeyword } = require("@bot-whatsapp/bot");

/**
 *
 * @returns
 */
const flowThankyou = (globalState) =>
  addKeyword(["gracias", "thankyou"])
    .addAction((_, { endFlow }) => {
      if (!globalState.status) {
        return endFlow();
      }
    })
    .addAnswer("Estamos para servir! Recuerda que el momento para comenzar a ganar es ahora!");

module.exports = { flowThankyou };
