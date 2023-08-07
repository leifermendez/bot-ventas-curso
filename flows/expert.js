const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { delay } = require("../utils");

/**
 * Flow de explicacion experta
 */
const flowVozExperto = () => addKeyword(EVENTS.ACTION).addAnswer(
  ["dame un momento..."],
  null,
  async (_, { flowDynamic, state }) => {
    const currentState = state.getMyState();

    const fullText = currentState.answer.split(". ");
    for (const txt of fullText) {
      await flowDynamic(txt);
      await delay(850);
    }
  }
);

module.exports = { flowVozExperto };
