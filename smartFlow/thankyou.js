const { addKeyword } = require("@bot-whatsapp/bot");

module.exports = addKeyword(["gracias", "thankyou"])
    .addAction((_, { endFlow, state, globalState }) => {

        const currentGlobalState = globalState.getMyState();
        if (!currentGlobalState.status) {
            return endFlow();
        }
        const currentState = state.getMyState();
        const baned = currentState?.baned ?? false
        if (baned) return endFlow();
        console.log(`[Flow Smart Gracias]`)
    })
    .addAnswer("Estamos para servir! Recuerda que el momento para comenzar a ganar es ahora!");