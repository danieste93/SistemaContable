const express = require('express');
const router = express.Router()
const apiController = require('../controler/apicontrol');


router.get('/pruebaFuncion', apiController.pruebaFuncion);
router.post('/validar-correo', apiController.validarCorreo);
router.post('/validar-usuario', apiController.validarUsuario);

module.exports = router;