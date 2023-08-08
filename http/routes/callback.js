const { Router } = require("express");
const { ctrlCallBack } = require("../controllers/callback");
const router = Router()

/**
 * Ruta cuando se realiza un pago exitoso
 */
router.get("/", ctrlCallBack);

module.exports = router