const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const notEmployee = require("./notEmployee");

const LIMIT_TEXT = parseInt(process.env.LIMIT_TEXT ?? 800)

module.exports = addKeyword(EVENTS.WELCOME)
    .addAnswer("⏱️")
    .addAction(async (ctx, ctxFn) => {
        console.log(`[Flow Smart Welcome]:${ctx.body}`)
        const employeesAddon = ctxFn.extensions.employeesAddon
        const text = ctx.body;
        const currentState = ctxFn.state.getMyState();
        const txt = currentState?.answer ?? ""
        if (txt.length > LIMIT_TEXT) {
            ctxFn.state.update({ answer: '' });
        }

        const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
        const { employee, answer } = await employeesAddon.determine(fullSentence);
        ctxFn.state.update({ answer });
        if (employee) employeesAddon.gotoFlow(employee, ctxFn);
        if (!employee) ctxFn.gotoFlow(notEmployee);
    });