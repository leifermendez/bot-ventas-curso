const { addKeyword } = require("@bot-whatsapp/bot");

/**
 *
 * @returns
 */
const flowOn = (globalState) =>
  addKeyword(["bananaon"],{sensitive:true})
    .addAction(() => {
      globalState.status = true
    })
    .addAnswer("BOT ON!");

const flowOff = (globalState) =>
  addKeyword(["bananaoff"],{sensitive:true})
    .addAction(() => {
      globalState.status = false
    })
    .addAnswer("BOT OFF!");

module.exports = { flowOn, flowOff };
