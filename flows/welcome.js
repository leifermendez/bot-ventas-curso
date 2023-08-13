const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const LIMIT_TEXT = parseInt(process.env.LIMIT_TEXT ?? 800)

const flowNotEmployeeWelcome = addKeyword(EVENTS.ACTION)
  .addAction((_, { endFlow, state }) => {

    const currentState = state.getMyState();
    const baned = currentState?.baned ?? false
    if (baned) return endFlow();

    if (!globalState.status) {
      return endFlow();
    }
  })
  .addAnswer(["Hmm no estoy seguro...", "Recuerda que estoy diseñado para asistir sobre el curso y vender el curso. ¿Tienes alguna pregunta sobre el curso?"],
    null, async (ctx, { state, flowDynamic }) => {
      const currentState = state.getMyState();
      state.update({ fallBack: currentState?.fallBack ?? 1 })
 
      if(currentState?.fallBack > 2){
        await flowDynamic(`Creo que no, nos estamos entendiendo. Vuelve dentro de 40min! 🤷‍♀️`)
        state.update({ baned:true })
      }
    });
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
      if (txt.length > LIMIT_TEXT) {
        ctxFn.state.update({ answer: '' });
      }

      const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
      const { employee, answer } = await employeesAddon.determine(fullSentence);
      ctxFn.state.update({ answer });
      if (employee) employeesAddon.gotoFlow(employee, ctxFn);
      if (!employee) ctxFn.gotoFlow(flowNotEmployeeWelcome);
    });

module.exports = { flowWelcome };
