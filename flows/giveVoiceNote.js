const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { handlerAI } = require("../utils");

/**
 * Flow cuando recibe nota de voz
 * @param {*} employeesAddon 
 * @returns 
 */
const flowVoiceNote = (employeesAddon) =>
  addKeyword(EVENTS.VOICE_NOTE).addAction(async (ctx, ctxFn) => {
    await ctxFn.flowDynamic("dame un momento para escucharte...🙉");
    const text = await handlerAI(ctx);
    const currentState = ctxFn.state.getMyState();
    const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
    const { employee, answer } = await employeesAddon.determine(fullSentence);
    ctxFn.state.update({ answer });
    employeesAddon.gotoFlow(employee, ctxFn);
  });
module.exports = { flowVoiceNote };
