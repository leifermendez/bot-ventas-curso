const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { delay } = require("../utils/utils");

module.exports = addKeyword(EVENTS.ACTION)
    .addAction((_, { endFlow, globalState }) => {

        const currentGlobalState = globalState.getMyState();
        if (!currentGlobalState.status) {
            return endFlow();
        }
    })
    .addAnswer(
        ["dame un momento-..."],
        null,
        async (_, { flowDynamic, state }) => {
            const currentState = state.getMyState();
            if(!currentState?.answer){
                return
            }
            const fullText = currentState.answer.split(". ");
            for (const txt of fullText) {
                await flowDynamic(txt);
                await delay(1150);
            }
        }
    );