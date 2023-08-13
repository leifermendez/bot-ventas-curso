const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { handlerAI } = require("../utils/utils");

const flowNotEmployeeVoice = addKeyword(EVENTS.ACTION)
  .addAction((_, { endFlow }) => {
    if (!globalState.status) {
      return endFlow();
    }
  })
  .addAnswer(["Hmm no estoy seguro...", "Recuerda que estoy diseñado para asistir sobre el curso y vender el curso. ¿Tienes alguna pregunta sobre el curso?"]);
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
