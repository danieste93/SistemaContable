const express = require('express');
const router = express.Router()
const zohoControler = require('../controler/zohoCorreo');


router.post('/send-welcome', zohoControler.CorreoBienvenida);


module.exports = router;