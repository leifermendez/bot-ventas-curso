const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

module.exports = addKeyword(EVENTS.DOCUMENT)
    .addAction((_, { endFlow, state, globalState }) => {

        const currentGlobalState = globalState.getMyState();
        if (!currentGlobalState.status) {
            return endFlow();
        }
        const currentState = state.getMyState();
        const baned = currentState?.baned ?? false
        if (baned) return endFlow();
        console.log(`[Flow Smart PDF]`)
    })
    .addAnswer(
        "la memoria de mi celular esta llena no puedo recibir mas archivos..intenta con una nota de voz"
    );