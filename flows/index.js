const { flowWelcome } = require("./welcome");
const { flowVozVentas } = require("./sales");
const { flowVozExperto } = require("./expert");
const { flowSendLink } = require("./linkPay");
const { flowAudioVideo } = require("./giveMedia");
const { flowPDF } = require("./givePdf");
const { flowAdios } = require("./bye.js");
const { flowVoiceNote } = require("./giveVoiceNote");

module.exports = {
  flowWelcome,
  flowVozVentas,
  flowVozExperto,
  flowSendLink,
  flowAudioVideo,
  flowPDF,
  flowAdios,
  flowVoiceNote
};
