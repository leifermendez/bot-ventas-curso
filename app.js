require("dotenv").config();
const express = require("express");
const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");
const { init } = require("bot-ws-plugin-openai");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MongoAdapter = require("./provider/mongo");
const { handlerAI } = require("./utils");
const { textToVoice } = require("./services/eventlab");
const { handlerStripe } = require("./services/stripe");
const app = express();
const fs = require("fs");
const delay = (miliseconds) =>
  new Promise((res) => setTimeout(res, miliseconds));

const promptCurso = fs.readFileSync("./promp.txt", "utf-8");
const prompPago = fs.readFileSync("./promp_pago.txt", "utf-8");

const employeesAddonConfig = {
  model: "gpt-4-0613",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
};

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const PORT = process.env.PORT ?? 4000;
const adapterDB = new MongoAdapter({
  dbUri: MONGO_DB_URI,
  dbName: MONGO_DB_NAME,
});
const adapterProvider = createProvider(BaileysProvider);

/**
 * API ZONE
 */

app.get("/api/send-success", async (req, res) => {
  const phone = req.query.phone;
  const check = await adapterDB.findIntent(phone);


  if(!check){
    res.send({ data: "error!" });
    return
  }

  if (!["success"].includes(check.status)) {
    await adapterProvider.sendText(
      `${phone}@c.us`,
      "Felicitaciones! ya tienes acceso al curso 🙌"
    );

    await adapterDB.updateIntent(phone, "success");
  }

  res.send({ data: "ok!" });
});

app.get("/api/send-fail", async (req, res) => {
  const phone = req.query.phone;
  const check = await adapterDB.findIntent(phone);

  if(!check){
    res.send({ data: "error!" });
    return
  }

  if (!["success", "fail"].includes(check.status)) {
    await adapterProvider.sendText(
      `${phone}@c.us`,
      "Ups! algo ocurrio con tu compra 😅 vuelve a intentar"
    );

    await adapterDB.updateIntent(phone, "fail");
  }

  res.send({ data: "ok!" });
});

/**
 * FIN API ZONE
 */

const employeesAddon = init(employeesAddonConfig);

const flowVozVentas = addKeyword(EVENTS.ACTION).addAnswer(
  ["dame un momento... mejor te envio nota de voz"],
  null,
  async (_, { flowDynamic, state }) => {
    console.log("🙉 texto a voz....");
    const currentState = state.getMyState();
    const path = await textToVoice(currentState.answer);
    console.log(`🙉 Fin texto a voz....[PATH]:${path}`);
    await flowDynamic([{ body: "escucha", media: path }]);
  }
);

const flowVozExperto = addKeyword(EVENTS.ACTION).addAnswer(
  ["dame un momento..."],
  null,
  async (_, { flowDynamic, state }) => {
    console.log("🙉 texto a voz....");
    const currentState = state.getMyState();

    const fullText = currentState.answer.split(". ");
    for (const txt of fullText) {
      await flowDynamic(txt);
      await delay(850);
    }
  }
);

const flowSendLink = addKeyword(EVENTS.ACTION)
  .addAnswer(["🚀🚀"], null, async (_, { flowDynamic, state }) => {
    console.log("🙉 texto a voz....");
    const currentState = state.getMyState();
    const txt = currentState.answer.replace(
      "https://link.codigoencasa.com/CURSO-CHATBOT",
      ""
    );
    await flowDynamic(txt);
    await flowDynamic("https://link.codigoencasa.com/CURSO-CHATBOT");
  })
  .addAnswer(
    [
      `Solo necesito un dato más para que comiences a disfrutar del contenido.`,
      `¿Cual es tu email?`,
    ],
    { capture: true },
    async (ctx, { fallBack, state }) => {
      const email = ctx.body;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(email)) {
        return fallBack(`Debes proporcionar un email valido`);
      }

      state.update({ email });
    }
  )
  .addAnswer(
    "Generando link de pago...",
    null,
    async (ctx, { flowDynamic }) => {
      const response = await handlerStripe();
      console.log(response);
    }
  );

/**
 * Flow Bievenida
 */
const flowWelcome = addKeyword(EVENTS.WELCOME)
  .addAnswer("⏱️")
  .addAction(async (ctx, ctxFn) => {
    const text = ctx.body;
    const currentState = ctxFn.state.getMyState();
    const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
    const { employee, answer } = await employeesAddon.determine(fullSentence);
    ctxFn.state.update({ answer });
    employeesAddon.gotoFlow(employee, ctxFn);
  });

/**
 * Flow recibe video
 */
const flowAudioVideo = addKeyword(EVENTS.MEDIA).addAnswer(
  "la memoria de mi celular esta llena no puedo recibir mas archivos..intenta con una nota de voz"
);

const flowPDF = addKeyword(EVENTS.DOCUMENT).addAnswer(
  "la memoria de mi celular esta llena no puedo recibir mas archivos..intenta con una nota de voz"
);

/**
 * Flow despedida
 */
const flowAdios = addKeyword(["adios", "bye", "chao"]).addAnswer("Nos vemos!");

/**
 * Flows AI
 */
const flowVoiceNote = addKeyword(EVENTS.VOICE_NOTE).addAction(
  async (ctx, ctxFn) => {
    await ctxFn.flowDynamic("dame un momento para escucharte...🙉");
    console.log("🤖 voz a texto....");
    const text = await handlerAI(ctx);
    console.log(`🤖 Fin voz a texto....[TEXT]: ${text}`);
    const currentState = ctxFn.state.getMyState();
    const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
    const { employee, answer } = await employeesAddon.determine(fullSentence);
    ctxFn.state.update({ answer });
    employeesAddon.gotoFlow(employee, ctxFn);
  }
);

const flowDemo = addKeyword("olo").addAnswer(
  "Generando link de pago...",
  null,
  async (ctx, { flowDynamic }) => {
    const response = await handlerStripe();
    await adapterDB.createIntent({
      url: response.url,
      phone: ctx.from,
      status: "wait",
      dateAt: new Date(),
    });
    await flowDynamic(`Este es tu link: ${response.url}`);
  }
);

const main = async () => {
  const adapterFlow = createFlow([
    flowDemo,
    flowAdios,
    flowWelcome,
    flowAudioVideo,
    flowVoiceNote,
    flowPDF,
    flowVozVentas,
    flowVozExperto,
    flowSendLink,
  ]);

  const employees = [
    {
      name: "EMPLEADO_ATENCION_CLIENTE",
      description: [
        "Soy Leifer el staff encargado de atentender las solicitudes de los clientes si tienen dudas,",
        " preguntas sobre el curso del chatbot de whatsapp, mis respuestas son breves e incitando a comprar el curso.",
      ].join(" "),
      flow: flowVozVentas,
    },
    {
      name: "EMPLEADO_EXPERTO_CURSO",
      description: [
        "Soy Leifer el staff experto en explicar más a detalles tecnicos del contenido,",
        " sobre el curso del chatbot de whatsapp, mis respuestas son breves, no mayores de 3 lineas e incitando a comprar el curso. ",
        `{contexto}: ${promptCurso}`,
      ].join(" "),
      flow: flowVozExperto,
    },
    {
      name: "EMPLEADO_ENVIAR_LINK_PAGO",
      description: [
        "Soy Ana la staff experta en cerra ventas encargada de proporcinar el link de pago",
        `{contexto}: ${prompPago}`,
      ].join(" "),
      flow: flowSendLink,
    },
  ];

  employeesAddon.employees(employees);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
};

main();
