const express = require('express');
const router = express.Router()
const apiController = require('../controler/apicontrol');



router.get('/pruebaFuncion', apiController.pruebaFuncion);
router.post('/validar-correo', apiController.validarCorreo);
router.post('/validar-usuario', apiController.validarUsuario);
router.post('/actualizar-facturacion', apiController.actualizarFacturacion);
router.post('/subir-comprobante-mem', apiController.subirComprobanteMeM);

// Consulta comprobante SRI
router.post('/sri-consulta', apiController.sriConsultaComprobante);

router.post('/activar-membresia-paypal', apiController.activarMembresiaPaypal);

module.exports = router;