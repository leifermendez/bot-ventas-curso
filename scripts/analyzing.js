
require('dotenv').config()
const { adapterDB } = require("../provider/database")
const { completion } = require('../services/chatgpt')

const PROMPT = `El analisis de la conversacion entre vendedor y cliente y teniendo como tres unicaciones opciones de feedback para saber si el clientes esta contento son (DESCONTENTO, NEUTRAL, CONTENTO): "%%" se determina que el usuario esta: `

const getPlainText = (data = null) => {
    if (!data) return
    return data.historial.join(',\n')
}

const run = async () => {
    await adapterDB.init()
    const list = await adapterDB.getLatestHistoyry(250)
    try {
        for (const single of list) {
            const dataPrompt = getPlainText(single)
            const response = await completion(PROMPT.replace('%%', dataPrompt))
            const anwser = response.data.choices[0].text.trim().replace('.', '').replace(' ', '').toUpperCase()
            console.log({numero: single.numero, anwser})
            await adapterDB.sentimentCustomer(single.numero, anwser)

        }
    } catch (err) {
        console.log(`Error:`, err)
    }
}

run()