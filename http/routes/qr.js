const { Router } = require("express");
const { ctrlQR } = require("../controllers/qr");
const router = Router()

/**
 * Ruta para obtener el QR Code
 */
router.get("/", ctrlQR);

module.exports = router