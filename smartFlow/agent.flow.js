const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const {join} = require('path')

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
        { delay: 2500 }
    )
    .addAnswer(
        ["sigo contactando a un agente 🙌"],
        { delay: 1500 }
    )
    .addAction(async (_,{flowDynamic}) => {
        const path = join(process.cwd(),'audio','audio-1.mp3')
        await flowDynamic([{ body: "escucha", media: path }]);
    })