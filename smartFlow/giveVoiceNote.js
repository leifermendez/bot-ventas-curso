const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { handlerAI } = require("../utils/utils");
const notEmployee = require("./notEmployee");

/**
 * - Debe ser capaz de buscar info en pinecone
 * - Generar pregunta independiente con un contexto de conversacion
 * - Esa pregunta -> buscar en pinecone = Datos de la base de datos
 * - Enviar nuevamente a GPT para dar respuesta compacta y amable
 * - bot-ws-plugin: Obtener el input original
 */

module.exports = addKeyword(EVENTS.VOICE_NOTE)
    .addAction((_, { endFlow, globalState }) => {
        const currentGlobalState = globalState.getMyState();
        if (!currentGlobalState.status) {
            return endFlow();
        }
    })
    .addAction(async (ctx, ctxFn) => {
        console.log(`[Flow Smart VoiceNote]`)
        const employeesAddon = ctxFn.extensions.employeesAddon
        await ctxFn.flowDynamic("dame un momento para escucharte...🙉");
        const text = await handlerAI(ctx);
        const currentState = ctxFn.state.getMyState();
        const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
        const { employee, answer } = await employeesAddon.determine(fullSentence);
        ctxFn.state.update({ answer });
        if (employee) employeesAddon.gotoFlow(employee, ctxFn);
        if (!employee) ctxFn.gotoFlow(notEmployee);
    });