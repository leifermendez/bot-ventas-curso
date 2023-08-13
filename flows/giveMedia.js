const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

/**
 *
 * @returns
 */
const flowAudioVideo = (globalState) =>
  addKeyword(EVENTS.MEDIA)
    .addAction((_, { endFlow, state }) => {

      const currentState = state.getMyState();
      const baned = currentState?.baned ?? false
      if(baned) return endFlow();

      if (!globalState.status) {
        return endFlow();
      }
    })
    .addAnswer(
      "la memoria de mi celular esta llena no puedo recibir mas archivos..intenta con una nota de voz"
    );

module.exports = { flowAudioVideo };
