const { addKeyword } = require("@bot-whatsapp/bot");

const fallBackEmailFlow = require('./fallBackEmail');
const { handlerStripe } = require("../services/stripe");

module.exports = addKeyword(["andorra"])
    .addAction((_, { endFlow, globalState }) => {
        const currentGlobalState = globalState.getMyState();
        if (!currentGlobalState.status) {
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
        async (ctx, { fallBack, state, flowDynamic, gotoFlow, extensions }) => {
            const adapterDB = extensions.database
            const currentState = state.getMyState();
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const email = ctx.body;
            const fallBackEmail = currentState?.fallBackEmail ?? 0

            if (!emailRegex.test(email)) {


                if (fallBackEmail > 2) {
                    return gotoFlow(fallBackEmailFlow)
                }

                state.update({ fallBackEmail: fallBackEmail + 1 })
                return fallBack("Debes introducir un email valido");
            }
            state.update({ email });
            await flowDynamic(`dame un momento para generarte un link de pago`); 
            await flowDynamic([{ body: `El cupon lo debes de aplicar aqui`, media: "https://i.imgur.com/Y1rBTFu.png" }]);

            const response = await handlerStripe(ctx.from, currentState.email);
            await adapterDB.createIntent({
                url: response.url,
                phone: ctx.from,
                status: "wait",
                dateAt: new Date(),
                email: currentState.email,
            });
            state.update({ answer: "" });
            await flowDynamic(`Este es tu link: ${response.url}`);
        }
    );