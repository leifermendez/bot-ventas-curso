const { addKeyword } = require("@bot-whatsapp/bot");

/**
 *
 * @returns
 */
const flowAdios = (globalState) =>
  addKeyword(["adios", "bye", "chao"])
    .addAction((_, { endFlow, state }) => {

      const currentState = state.getMyState();
      const baned = currentState?.baned ?? false
      if(baned) return endFlow();

      if (!globalState.status) {
        return endFlow();
      }
    })
    .addAnswer("Nos vemos!");

module.exports = { flowAdios };
