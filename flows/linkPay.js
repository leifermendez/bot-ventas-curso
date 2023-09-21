const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { join } = require('path')
const { handlerStripe } = require("../services/stripe");


const flowFallBackEmail = () => addKeyword(EVENTS.ACTION).addAnswer([
  `🤦‍♂️`,
  'Mejor empezamos de nuevo ¿Como te puedo ayudar?',
  'Recuerda que estoy aquí para vender...'])

/**
 * Flow Generar Link de Pago
 * @param {*} adapterDB
 * @returns
 */
const flowSendLink = (globalState, adapterDB) =>
  addKeyword(["andorra"])
    .addAction((_, { endFlow, state }) => {

      const currentState = state.getMyState();
      const baned = currentState?.baned ?? false
      if (baned) return endFlow();

      if (!globalState.status) {
        return endFlow();
      }
    })
    .addAnswer(["🚀🚀"], null, async (_, { flowDynamic, state }) => {
      const currentState = state.getMyState();
      await flowDynamic(currentState);
    })
    .addAnswer(
      `Solo un dato más ¿Cual es tu email?`,
      { capture: true },
      async (ctx, { fallBack, state, flowDynamic, gotoFlow }) => {
        const currentState = state.getMyState();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const email = ctx.body;
        const fallBackEmail = currentState?.fallBackEmail ?? 0

        if (!emailRegex.test(email)) {


          if (fallBackEmail > 2) {
            return gotoFlow(flowFallBackEmail())
          }

          state.update({ fallBackEmail: fallBackEmail + 1 })
          return fallBack("Debes introducir un email valido");
        }
        state.update({ email });
        await flowDynamic([{ body: `El cupon lo debes de aplicar aqui`, media: "https://i.imgur.com/Y1rBTFu.png" }]);
        const name = ctx?.pushName ?? ctx.ProfileName.split(" ").shift();
        const response = await handlerStripe(ctx.from, currentState.email);
        await adapterDB.createIntent({
          url: response.url,
          phone: ctx.from,
          name: name,
          status: "wait",
          dateAt: new Date(),
          email: currentState.email,
        });
        state.update({ answer: "" });
        await flowDynamic(`Este es tu link: ${response.url}`);
      }
    );

module.exports = { flowSendLink, flowFallBackEmail };
