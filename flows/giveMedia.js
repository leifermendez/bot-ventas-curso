const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

/**
 * 
 * @returns 
 */
const flowAudioVideo = () => addKeyword(EVENTS.MEDIA).addAnswer(
    "la memoria de mi celular esta llena no puedo recibir mas archivos..intenta con una nota de voz"
  );

module.exports = { flowAudioVideo };
