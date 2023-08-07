const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { handlerStripe } = require("../services/stripe");

/**
 * Flow Generar Link de Pago
 * @param {*} adapterDB 
 * @returns 
 */
const flowSendLink = (adapterDB) =>
  addKeyword(EVENTS.ACTION)
    .addAnswer(["🚀🚀"], null, async (_, { flowDynamic, state }) => {
      const currentState = state.getMyState();
      await flowDynamic(currentState);
    })
    .addAnswer(`El cupon lo debes de aplicar aqui`, {
      media: "https://i.imgur.com/Y1rBTFu.png",
    })
    .addAnswer(
      "Generando link de pago...",
      null,
      async (ctx, { flowDynamic }) => {

        const response = await handlerStripe(ctx.from);

        await adapterDB.createIntent({
          url: response.url,
          phone: ctx.from,
          status: "wait",
          dateAt: new Date(),
        });

        await flowDynamic(`Este es tu link: ${response.url}`);

      }
    );

module.exports = { flowSendLink };
