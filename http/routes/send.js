const { Router } = require("express");
const { ctrlSend } = require("../controllers/send");
const router = Router()

/**
 * Ruta cuando se realiza un pago exitoso
 */
router.post("/", ctrlSend);

module.exports = router