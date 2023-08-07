const fs = require('fs')

const promptCurso = fs.readFileSync(`${process.cwd()}/prompt/promp.txt`, "utf-8");
const prompPago = fs.readFileSync(`${process.cwd()}/prompt/promp_pago.txt`, "utf-8");

/**
 * Lista de agentes
 * @param {*} flows 
 * @returns 
 */
const employees = (flows) => [
    {
      name: "EMPLEADO_ATENCION_CLIENTE",
      description: [
        "Soy Leifer el staff encargado de atentender las solicitudes de los clientes si tienen dudas,",
        " preguntas sobre el curso del chatbot de whatsapp, mis respuestas son breves e incitando a comprar el curso.",
      ].join(" "),
      flow: flows[0],
    },
    {
      name: "EMPLEADO_EXPERTO_CURSO",
      description: [
        "Soy Leifer el staff experto en explicar más a detalles tecnicos del contenido,",
        " sobre el curso del chatbot de whatsapp, mis respuestas son breves, no mayores de 3 lineas e incitando a comprar el curso. ",
        `{contexto}: ${promptCurso}`,
      ].join(" "),
      flow: flows[1],
    },
    {
      name: "EMPLEADO_ENVIAR_LINK_PAGO",
      description: [
        "Soy Ana la staff experta en cerra ventas encargada de proporcinar el link de pago",
        `{contexto}: ${prompPago}`,
      ].join(" "),
      flow: flows[2],
    },
  ];


module.exports = { employees };
