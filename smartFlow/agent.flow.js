const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

module.exports = addKeyword(EVENTS.ACTION)
    .addAction((_, { endFlow, globalState }) => {
        const currentGlobalState = globalState.getMyState();
        if (!currentGlobalState.status) {
            return endFlow();
        }
        console.log(`[Flow Smart Agente]`)
    })
    .addAnswer(
        ["un momento... consultado disponibilidad de agentes"],
        { delay: 2500 },
        async (_, { flowDynamic }) => {
            await flowDynamic([
                {
                    body: `Actualmente el agente Leifer esta saturado lo siento 🤷‍♂️`
                },
                {
                    body: `Si tienes una consulta más urgente te recomiendo enviar un mail a leifer.contacto@gmail.com`
                }
            ]);
        }
    );