const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { textToVoice } = require("../services/eventlab");

/**
 * Flow de notas de voz sobre ventas
 */
const flowVozVentas = (globalState) => addKeyword(EVENTS.ACTION)
.addAction((_, {endFlow}) => {
  if(!globalState.status){
    return endFlow()
  }
})
.addAnswer(
  ["dame un momento... mejor te envio nota de voz"],
  null,
  async (_, { flowDynamic, state }) => {
    console.log("🙉 texto a voz....");
    const currentState = state.getMyState();
    const path = await textToVoice(currentState.answer);
    console.log(`🙉 Fin texto a voz....[PATH]:${path}`);
    await flowDynamic([{ body: "escucha", media: path }]);
  }
);

module.exports = { flowVozVentas };
