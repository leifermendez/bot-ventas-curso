const { Router } = require("express");
const { ctrlSuccessPayment } = require("../controllers/callback");
const router = Router()

/**
 * Ruta cuando se realiza un pago exitoso
 */
router.get("/", ctrlSuccessPayment);

module.exports = router