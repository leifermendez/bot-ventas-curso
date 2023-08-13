const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { handlerAI } = require("../utils/utils");

const flowNotEmployeeVoice = addKeyword(EVENTS.ACTION)
  .addAction((_, { endFlow , state}) => {

    const currentState = state.getMyState();
    const baned = currentState?.baned ?? false
    if(baned) return endFlow();

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
 * Flow cuando recibe nota de voz
 * @param {*} employeesAddon
 * @returns
 */
const flowVoiceNote = (globalState, employeesAddon) =>
  addKeyword(EVENTS.VOICE_NOTE)
    .addAction((_, { endFlow }) => {
      if (!globalState.status) {
        return endFlow();
      }
    })
    .addAction(async (ctx, ctxFn) => {
      await ctxFn.flowDynamic("dame un momento para escucharte...🙉");
      const text = await handlerAI(ctx);
      const currentState = ctxFn.state.getMyState();
      const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
      const { employee, answer } = await employeesAddon.determine(fullSentence);
      ctxFn.state.update({ answer });
      if (employee) employeesAddon.gotoFlow(employee, ctxFn);
      if (!employee) ctxFn.gotoFlow(flowNotEmployeeVoice);
    });
module.exports = { flowVoiceNote };
