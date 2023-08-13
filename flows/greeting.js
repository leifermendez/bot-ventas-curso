const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { delay } = require("../utils/utils");

/**
 * Flow de explicacion experta
 */
const flowGreeting = (globalState) =>
  addKeyword(['hola','hi'])
    .addAction((_, { endFlow, state }) => {

      const currentState = state.getMyState();
      const baned = currentState?.baned ?? false
      if(baned) return endFlow();

      if (!globalState.status) {
        return endFlow();
      }
    })
    .addAction(async (_, { flowDynamic, state }) => {
      state.update({ answer: "" });
      await flowDynamic(`Buenas estoy aqui para vender! como puedo ayudarte`);
    });

module.exports = { flowGreeting };
