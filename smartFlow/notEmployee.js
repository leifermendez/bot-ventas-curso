const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

module.exports = addKeyword(EVENTS.ACTION)
    .addAction((_, { endFlow, state, globalState }) => {

        const currentGlobalState = globalState.getMyState();
        if (!currentGlobalState.status) {
            return endFlow();
        }
        const currentState = state.getMyState();
        const baned = currentState?.baned ?? false
        if (baned) return endFlow();
    })
    .addAction(async (ctx, { flowDynamic, extensions, state }) => {
        const chatwood = extensions.chatwood;
        const currentState = state.getMyState();
        state.update({ fallBack: currentState?.fallBack ?? 1 })
        const name = ctx?.pushName ?? ctx.ProfileName.split(" ").shift();
        if (currentState?.fallBack > 2) {
            const msg = `Creo que no, nos estamos entendiendo. Vuelve dentro de 40min! 🤷‍♀️`
            await chatwood.createMessage({
                msg: msg,
                mode: "outgoing",
                conversationId: currentState.conversation_id,
            });
            await flowDynamic(msg)
            state.update({ baned: true })
            return
        }

        const msg = [name,"Hmm no estoy seguro...", "Recuerda que estoy diseñado para asistir sobre el curso y vender el curso. ¿Tienes alguna pregunta sobre el curso?"].join('\n')
        await chatwood.createMessage({
            msg: msg,
            mode: "outgoing",
            conversationId: currentState.conversation_id,
        });
        await flowDynamic()
    })