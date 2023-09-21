const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const notEmployee = require("./notEmployee");
const chatwootMiddleware = require("../middleware/chatwoot.middleware");

const LIMIT_TEXT = parseInt(process.env.LIMIT_TEXT ?? 800)

module.exports = addKeyword(EVENTS.WELCOME)
    .addAnswer("⏱️")
    .addAction(chatwootMiddleware)
    .addAction(async (ctx, ctxFn) => {
        const chatwood = ctxFn.extensions.chatwood;
        const currentState = ctxFn.state.getMyState();
        const body = ctx.body;

        console.log(`[Flow Smart Welcome]:${ctx.body}`)

        await chatwood.createMessage({
            msg: body,
            mode: "incoming",
            conversationId: currentState.conversation_id,
          });

        const employeesAddon = ctxFn.extensions.employeesAddon

        const txt = currentState?.answer ?? ""
        if (txt.length > LIMIT_TEXT) {
            await ctxFn.state.update({ answer: '' });
        }

        const fullSentence = `${currentState?.answer ?? ""}. ${body}`;
        
        const { employee, answer } = await employeesAddon.determine(fullSentence);
        await ctxFn.state.update({ answer });
        console.log('Antes de pasar a gotoFlow',ctxFn.state.getMyState(),'==',currentState)
        if (employee) employeesAddon.gotoFlow(employee, ctxFn);
        if (!employee) ctxFn.gotoFlow(notEmployee);
    });