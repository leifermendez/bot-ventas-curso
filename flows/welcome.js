const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const flowNotEmployeeWelcome = addKeyword(EVENTS.ACTION)
  .addAction((_, { endFlow }) => {
    if (!globalState.status) {
      return endFlow();
    }
  })
  .addAnswer("No entendi puedes explicarte mejor");
/**
 * Flujo principal
 * @param {*} employeesAddon
 * @returns
 */
const flowWelcome = (globalState, employeesAddon) =>
  addKeyword(EVENTS.WELCOME)
    .addAction((_, { endFlow }) => {
      if (!globalState.status) {
        return endFlow();
      }
    })
    .addAnswer("⏱️")
    .addAction(async (ctx, ctxFn) => {
      const text = ctx.body;
      const currentState = ctxFn.state.getMyState();
      const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
      const { employee, answer } = await employeesAddon.determine(fullSentence);
      ctxFn.state.update({ answer });
      if (employee) employeesAddon.gotoFlow(employee, ctxFn);
      if (!employee) ctxFn.gotoFlow(flowNotEmployeeWelcome);
    });

module.exports = { flowWelcome };
