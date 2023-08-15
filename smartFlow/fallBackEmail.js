const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

module.exports = addKeyword(EVENTS.ACTION).addAnswer([
    `🤦‍♂️`,
    'Mejor empezamos de nuevo ¿Como te puedo ayudar?',
    'Recuerda que estoy aquí para vender...'])