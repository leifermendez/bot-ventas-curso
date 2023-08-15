const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

module.exports = addKeyword(EVENTS.ACTION)
    .addAction((_, { endFlow, state, globalState }) => {
        const currentGlobalState = globalState.getMyState();
        const currentState = state.getMyState();
        const baned = currentState?.baned ?? false
        if (baned) return endFlow();

        if (!currentGlobalState.status) {
            return endFlow();
        }
    })
    .addAnswer(["Hmm no estoy seguro...", "Recuerda que estoy diseñado para asistir sobre el curso y vender el curso. ¿Tienes alguna pregunta sobre el curso?"],
        null, async (_, { state, flowDynamic }) => {
            const currentState = state.getMyState();
            state.update({ fallBack: currentState?.fallBack ?? 1 })

            if (currentState?.fallBack > 2) {
                await flowDynamic(`Creo que no, nos estamos entendiendo. Vuelve dentro de 40min! 🤷‍♀️`)
                state.update({ baned: true })
            }
        });