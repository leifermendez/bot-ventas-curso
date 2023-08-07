const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const flowWelcome = (employeesAddon)  => addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, ctxFn) => {
    const text = ctx.body
    const currentState = ctxFn.state.getMyState();
    const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
    const { employee, answer } = await employeesAddon.determine(fullSentence);
    ctxFn.state.update({ answer });
    employeesAddon.gotoFlow(employee, ctxFn);
  }
);

module.exports = flowWelcome;
