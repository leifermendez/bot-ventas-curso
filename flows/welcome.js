const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

/**
 * Flujo principal
 * @param {*} employeesAddon 
 * @returns 
 */
const flowWelcome = (employeesAddon) =>
  addKeyword(EVENTS.WELCOME)
    .addAnswer("⏱️")
    .addAction(async (ctx, ctxFn) => {
      const text = ctx.body;
      const currentState = ctxFn.state.getMyState();
      const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
      const { employee, answer } = await employeesAddon.determine(fullSentence);
      ctxFn.state.update({ answer });
      employeesAddon.gotoFlow(employee, ctxFn);
    });

module.exports = { flowWelcome };
