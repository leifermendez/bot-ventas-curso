const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { delay } = require("../utils/utils");

/**
 * Flow de explicacion experta
 */
const flowGreeting = (globalState) =>
  addKeyword(['hola','ole','hi'])
    .addAction((_, { endFlow }) => {
      if (!globalState.status) {
        return endFlow();
      }
    })
    .addAction(async (_, { flowDynamic, state }) => {
      const currentState = state.getMyState();
      state.update({ answer: "" });
      const fullText = currentState.answer.split(". ");
      for (const txt of fullText) {
        await flowDynamic(txt);
        await delay(1150);
      }
    });

module.exports = { flowGreeting };
