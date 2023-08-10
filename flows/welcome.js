const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const LIMIT_TEXT = parseInt(process.env.LIMIT_TEXT ?? 800)

const flowNotEmployeeWelcome = addKeyword(EVENTS.ACTION)
  .addAction((_, { endFlow }) => {
    if (!globalState.status) {
      return endFlow();
    }
  })
  .addAnswer("No entendi, me puedes escribir todo en un mensaje...😶");
/**
 * Flujo principal
 * @param {*} employeesAddon
 * @returns
 */
const flowWelcome = (globalState, employeesAddon) =>
  addKeyword(EVENTS.WELCOME)
    .addAnswer("⏱️")
    .addAction(async (ctx, ctxFn) => {
      const text = ctx.body;
      const currentState = ctxFn.state.getMyState();
      const txt = currentState?.answer ?? ""
      if(txt.length > LIMIT_TEXT){
        ctxFn.state.update({ answer: '' });
      }

      const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
      const { employee, answer } = await employeesAddon.determine(fullSentence);
      ctxFn.state.update({ answer });
      if (employee) employeesAddon.gotoFlow(employee, ctxFn);
      if (!employee) ctxFn.gotoFlow(flowNotEmployeeWelcome);
    });

module.exports = { flowWelcome };
