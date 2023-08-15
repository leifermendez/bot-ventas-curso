const { addKeyword } = require("@bot-whatsapp/bot");

module.exports = addKeyword(["bananaon"], { sensitive: true })
    .addAction((_,{globalState}) => {
        globalState.update({status:true})
    })
    .addAnswer("BOT ON!");