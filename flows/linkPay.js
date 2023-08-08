const { addKeyword } = require("@bot-whatsapp/bot");
const { handlerStripe } = require("../services/stripe");

/**
 * Flow Generar Link de Pago
 * @param {*} adapterDB
 * @returns
 */
const flowSendLink = (globalState, adapterDB) =>
  addKeyword(["andorra"])
    .addAction((_, { endFlow }) => {
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
      async (ctx, { fallBack, state }) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const email = ctx.body;

        if (!emailRegex.test(email)) {
          return fallBack("Debes introducir un email valido");
        }

        state.update({ email });
      }
    )
    .addAnswer(`El cupon lo debes de aplicar aqui`, {
      media: "https://i.imgur.com/Y1rBTFu.png",
    })
    .addAnswer(
      "Generando link de pago...",
      null,
      async (ctx, { flowDynamic, state }) => {
        const currentState = state.getMyState();
        const response = await handlerStripe(ctx.from, currentState.email);
        await adapterDB.createIntent({
          url: response.url,
          phone: ctx.from,
          status: "wait",
          dateAt: new Date(),
          email: currentState.email,
        });

        await flowDynamic(`Este es tu link: ${response.url}`);
      }
    );

module.exports = { flowSendLink };
