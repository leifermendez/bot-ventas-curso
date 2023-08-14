const { addKeyword } = require("@bot-whatsapp/bot");

/**
 * - Debe ser capaz de buscar info en pinecone
 * - Generar pregunta independiente con un contexto de conversacion
 * - Esa pregunta -> buscar en pinecone = Datos de la base de datos
 * - Enviar nuevamente a GPT para dar respuesta compacta y amable
 * - bot-ws-plugin: Obtener el input original
 */
module.exports = addKeyword('DEMO').addAnswer('Hola demo', null , async ({exentions, state, globalState}) => {
    const adapterDB = exentions.adapterDB
    const employeesAddon = exentions.employeesAddon
    const pinecone = extension.pinecone
    const queue = extension.queue
})