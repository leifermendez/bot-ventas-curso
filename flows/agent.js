const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

/**
 * Flow de explicacion experta
 */
const flowAgent = (globalState) =>
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
      ["un momento... consultado disponibilidad de agentes"],
      { delay: 2500 },
      async (_, { flowDynamic }) => {
        await flowDynamic([
          {
            body:`Actualmente el agente Leifer esta saturado lo siento 🤷‍♂️`
          },
          {
            body:`Si tienes una consulta más urgente te recomiendo enviar un mail a leifer.contacto@gmail.com`
          }
        ]);
      }
    );

module.exports = { flowAgent };
