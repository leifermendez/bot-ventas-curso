const { addKeyword } = require("@bot-whatsapp/bot");

/**
 *
 * @returns
 */
const flowThankyou = (globalState) =>
  addKeyword(["gracias", "thankyou"])
    .addAction((_, { endFlow, state }) => {

      const currentState = state.getMyState();
      const baned = currentState?.baned ?? false
      if (baned) return endFlow();

      if (!globalState.status) {
        return endFlow();
      }
    })
    .addAnswer("Estamos para servir! Recuerda que el momento para comenzar a ganar es ahora!");

module.exports = { flowThankyou };
