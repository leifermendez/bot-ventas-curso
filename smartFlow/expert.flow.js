const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { delay } = require("../utils/utils");
const { textToVoice } = require("../services/eventlab");

module.exports = addKeyword(EVENTS.ACTION)
    .addAction((_, { endFlow, globalState }) => {
        const currentGlobalState = globalState.getMyState();
        if (!currentGlobalState.status) {
            return endFlow();
        }
    })
    .addAnswer(
        ["dame un momento ..."]
    )
    .addAction(async (_, {extensions, state, flowDynamic}) => {
        const chatwood = extensions.chatwood;
        const currentState = state.getMyState();

        if(!currentState?.answer){
            return
        }

        console.log(currentState.answer.length, 'enviar nota de voz')
        if(currentState.answer.length > 720 && !currentState?.voice_note){
            const msg =  ["dame un momento... mejor te envio nota de voz"].join('\n')
            await flowDynamic(msg)
            const path = await textToVoice(currentState.answer);
            await flowDynamic([{ body: "escucha", media: path }]);
            await chatwood.createMessage({
                msg: `*voice_note* ${currentState.answer}`,
                mode: "outgoing",
                conversationId: currentState.conversation_id,
            });
            await state.update({voice_note:true})
            return
        }

        const fullText = currentState.answer.split(". ");

        for (const txt of fullText) {
            await flowDynamic(txt);
            console.log('>>',currentState.conversation_id)
            console.log('>>',txt)
            await chatwood.createMessage({
                msg: txt,
                mode: "outgoing",
                conversationId: currentState.conversation_id,
            });
            await delay(150);
        }

     
    })
  