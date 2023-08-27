const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { delay } = require("../utils/utils");

/**
 * Flow de explicacion experta
 */
const flowVozExperto = (globalState) =>
  addKeyword(EVENTS.ACTION)
    .addAction((_, { endFlow, state }) => {

      const currentState = state.getMyState();
      const baned = currentState?.baned ?? false
      if(baned) return endFlow();

      if (!globalState.status) {
        return endFlow();
      }
    })
    .addAnswer(
      ["dame un momento*..."],
      null,
      async (_, { flowDynamic, state }) => {
        const currentState = state.getMyState();

        const fullText = currentState.answer.split(". ");
        for (const txt of fullText) {
          await flowDynamic(txt);
          await delay(1150);
        }
      }
    );

module.exports = { flowVozExperto };
