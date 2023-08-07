require("dotenv").config();
const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");

const ServerAPI = require("./http");

/**
 * TODO:
 * - Arreglar las nuevas url de callback
 * - remove cosas no usadas
 */

const {
  flowWelcome,
  flowVozVentas,
  flowAdios,
  flowAudioVideo,
  flowPDF,
  flowSendLink,
  flowVoiceNote,
  flowVozExperto,
} = require("./flows");

const { adapterDB } = require("./provider/database");
const { employees } = require("./provider/agents");
const { employeesAddon } = require("./provider/agents/config");

const main = async () => {
  const adapterProvider = createProvider(BaileysProvider);
  const httpServer = new ServerAPI(adapterProvider);

  const flowsAgents = [
    flowVozVentas(),
    flowVozExperto(),
    flowSendLink(adapterDB),
  ];

  const flows = [
    flowWelcome(employeesAddon),
    flowVoiceNote(employeesAddon),
    flowAdios(),
    flowPDF(),
    flowAudioVideo(),
  ];

  employeesAddon.employees(employees(flowsAgents));

  const adapterFlow = createFlow([...flowsAgents, ...flows]);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  httpServer.start()
};

main();
