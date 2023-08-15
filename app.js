require("dotenv").config();
const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");

const ServerAPI = require("./http");

const {
  flowWelcome,
  flowVozVentas,
  flowAdios,
  flowAudioVideo,
  flowPDF,
  flowSendLink,
  flowVoiceNote,
  flowVozExperto,
  flowOn,
  flowOff,
  flowGreeting,
  flowThankyou,
  flowAgent,
  flowFallBackEmail,
} = require("./flows");

const { adapterDB } = require("./provider/database");
const { employees } = require("./provider/agents");
const { employeesAddon } = require("./provider/agents/config");

const giveVoiceNote = require("./smartFlow/giveVoiceNote");
const welcome = require("./smartFlow/welcome");
const bye = require("./smartFlow/bye");
const givePdf = require("./smartFlow/givePdf");
const giveMedia = require("./smartFlow/giveMedia");
const turnOff = require("./smartFlow/turnOff");
const turnOn = require("./smartFlow/turnOn");
const thankyou = require("./smartFlow/thankyou");
const fallBackEmail = require("./smartFlow/fallBackEmail");
const notEmployee = require("./smartFlow/notEmployee");
const ventasFlow = require("./smartFlow/ventas.flow");
const expertFlow = require("./smartFlow/expert.flow");
const linkPayFlow = require("./smartFlow/linkPay.flow");
const greetingFlow = require("./smartFlow/greeting.flow");
const agentFlow = require("./smartFlow/agent.flow");
// const loadSmartFlows = require("./smartFlow");

const main = async () => {
  await adapterDB.init();


  const adapterProvider = createProvider(BaileysProvider);
  const httpServer = new ServerAPI(adapterProvider, adapterDB);

  /**
   * ESTO SE TIENE QUE REMPLAZAR
   */
  const flowsAgents = [
    ventasFlow,
    expertFlow,
    linkPayFlow,
    greetingFlow,
    agentFlow
  ];


  const flows = [
    welcome,
    giveVoiceNote,
    bye,
    givePdf,
    giveMedia,
    turnOff,
    turnOn,
    thankyou,
    fallBackEmail,
    notEmployee
  ];

  employeesAddon.employees(await employees(flowsAgents, adapterDB));

  const adapterFlow = createFlow([...flowsAgents, ...flows]);

  /**
   * - Como segundo argumento podemos pasar properties como globalState, extensions
   * - Como tercer argumento una funcion que se ejecute internamente como un listener
   */
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  }, {
    globalState: {
      status: true
    },
    extensions: {
      employeesAddon,
      database: adapterDB,
    }
  });


  httpServer.start();
};

main();
