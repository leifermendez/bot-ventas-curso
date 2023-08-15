const { addKeyword } = require("@bot-whatsapp/bot");

module.exports = addKeyword(["adios", "bye", "chao"])
    .addAction((_, { endFlow, state, globalState }) => {

        const currentGlobalState = globalState.getMyState();
        if (!currentGlobalState.status) {
            return endFlow();
        }
        console.log(`[Flow Smart Bye]`)
        const currentState = state.getMyState();
        const baned = currentState?.baned ?? false
        if (baned) return endFlow();

    })
    .addAnswer("Nos vemos!");