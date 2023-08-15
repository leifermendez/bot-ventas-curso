const { addKeyword } = require("@bot-whatsapp/bot");

module.exports = addKeyword(["bananaoff"], { sensitive: true })
    .addAction((_,{globalState}) => {
        globalState.update({status:false})
    })
    .addAnswer("BOT OFF!");