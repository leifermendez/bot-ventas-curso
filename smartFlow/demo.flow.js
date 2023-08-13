const { addKeyword } = require("@bot-whatsapp/bot");

module.exports = addKeyword('DEMO').addAnswer('Hola demo', null , async ({exentions, state, globalState}) => {
    const adapterDB = exentions.adapterDB
    const employeesAddon = exentions.employeesAddon
})