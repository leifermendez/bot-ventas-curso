const { readdirSync } = require('fs')

const CURRENT_DIR = __dirname;

/**
 * Leer directorio de forma automaticamente
 */
const listStamartFlows = readdirSync(CURRENT_DIR).map((fileName) => {
    if (!fileName.includes('index')) {
        console.log(`[SMART FLOW] cargado:`, fileName)
        return require(`${CURRENT_DIR}/${fileName}`)
    }
}).filter(_ => !!_)

module.exports = listStamartFlows