const { addKeyword } = require("@bot-whatsapp/bot");

module.exports = addKeyword(['hola', 'hi'])
    .addAction((_, { endFlow, globalState }) => {
        const currentGlobalState = globalState.getMyState();
        console.log({currentGlobalState})
        if (!currentGlobalState.status) {
            return endFlow();
        }
    })
    .addAction(async (_, { flowDynamic, state }) => {
        state.update({ answer: "" });
        await flowDynamic(`Buenas estoy aqui para vender! como puedo ayudarte`);
    });